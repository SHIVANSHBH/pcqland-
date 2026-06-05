import { signIn } from 'next-auth/react';
import { api, setAccessToken } from './api';

/**
 * Store the access token, create the NextAuth session,
 * fetch user profile from backend, and redirect based on role.
 * Call this after every successful Supabase login/signup/OTP-verify.
 */
export async function syncAuthAndRedirect(accessToken: string, router: any) {
  setAccessToken(accessToken);

  try {
    const result = await signIn('token', { accessToken, redirect: false });
    if (!result?.ok) {
      console.warn('NextAuth token sign-in failed, falling back to direct redirect');
    }
  } catch (err) {
    console.warn('NextAuth token sign-in threw, falling back', err);
  }

  try {
    const data = await api.get('/auth/me');
    const user = data?.data;
    if (user?.role === 'admin') {
      router.push('/admin');
      router.refresh();
      return;
    }
  } catch {
    // ignore — redirect to home
  }

  router.push('/');
  router.refresh();
}
