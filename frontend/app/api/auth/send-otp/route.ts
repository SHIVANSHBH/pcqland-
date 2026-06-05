import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email, phone } = await req.json();
    if (!email && !phone) {
      return NextResponse.json(
        { success: false, message: 'Email or phone is required' },
        { status: 400 },
      );
    }

    const identifier = email || phone;
    const type = email ? 'email' : 'phone';

    const supabase = await createClient();

    const { data: existing } = await supabase
      .from('rate_limits')
      .select('attempts, window_start')
      .eq('identifier', identifier)
      .eq('action', `otp_${type}`)
      .gte('window_start', new Date(Date.now() - 10 * 60 * 1000).toISOString())
      .maybeSingle();

    if (existing && existing.attempts >= 3) {
      return NextResponse.json(
        { success: false, message: 'Too many OTP requests. Please try again after 10 minutes.' },
        { status: 429 },
      );
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    await supabase.from('otps').insert({
      identifier,
      type,
      otp,
      expires_at: expiresAt,
    });

    if (existing) {
      await supabase
        .from('rate_limits')
        .update({ attempts: existing.attempts + 1 })
        .eq('identifier', identifier)
        .eq('action', `otp_${type}`);
    } else {
      await supabase.from('rate_limits').insert({
        identifier,
        action: `otp_${type}`,
        attempts: 1,
        window_start: new Date().toISOString(),
      });
    }

    console.log(`[OTP] OTP sent to ${identifier} via ${type}`);

    return NextResponse.json({
      success: true,
      message: `OTP sent to your ${type}`,
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to send OTP' },
      { status: 500 },
    );
  }
}
