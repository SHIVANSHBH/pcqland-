import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { email, phone, otp } = await req.json();

    if (!otp || (!email && !phone)) {
      return NextResponse.json(
        { success: false, message: 'OTP and email/phone are required' },
        { status: 400 },
      );
    }

    const identifier = email || phone;
    const supabase = await createClient();

    const { data: otpRecord } = await supabase
      .from('otps')
      .select('*')
      .eq('identifier', identifier)
      .eq('otp', otp)
      .is('verified_at', null)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired OTP' },
        { status: 400 },
      );
    }

    await supabase
      .from('otps')
      .update({ attempts: otpRecord.attempts + 1, verified_at: new Date().toISOString() })
      .eq('id', otpRecord.id);

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      data: { identifier, type: otpRecord.type },
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to verify OTP' },
      { status: 500 },
    );
  }
}
