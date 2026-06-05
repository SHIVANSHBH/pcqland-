import { signIn } from 'next-auth/react';
import { api } from './api';

const API_BASE: string = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Sync Supabase session with backend, fetch user profile,
 * and redirect based on role.
 */
export async function syncAuthAndRedirect(accessToken: string, router: any) {
  try {
    const syncRes = await fetch(`${API_BASE}/auth/supabase-sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
      body: JSON.stringify({ accessToken }),
      credentials: 'include',
    });
    const syncData = await syncRes.json();
    if (!syncData.success) {
      console.warn('Supabase sync failed, falling back');
    }
  } catch (err) {
    console.warn('Supabase sync threw, falling back', err);
  }

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
