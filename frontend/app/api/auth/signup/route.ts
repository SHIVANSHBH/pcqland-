import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters' },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists' },
        { status: 409 },
      );
    }

    if (phone) {
      const { data: existingPhone } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', phone)
        .maybeSingle();

      if (existingPhone) {
        return NextResponse.json(
          { success: false, message: 'An account with this phone number already exists' },
          { status: 409 },
        );
      }
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        data: {
          name,
          phone,
        },
      },
    });

    if (signUpError) {
      return NextResponse.json(
        { success: false, message: signUpError.message },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please verify your email.',
      data: {
        userId: authData.user?.id,
        email: email.toLowerCase(),
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create account' },
      { status: 500 },
    );
  }
}
