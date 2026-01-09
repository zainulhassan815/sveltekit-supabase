import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, locals, url }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Server-side validation
    if (!email || !email.includes('@')) {
      return fail(400, {
        error: 'Please enter a valid email address',
        values: { email }
      });
    }

    if (!password || password.length < 6) {
      return fail(400, {
        error: 'Password must be at least 6 characters',
        values: { email }
      });
    }

    if (password !== confirmPassword) {
      return fail(400, {
        error: 'Passwords do not match',
        values: { email }
      });
    }

    const { error } = await locals.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${url.origin}/auth/callback`
      }
    });

    if (error) {
      return fail(400, {
        error: error.message,
        values: { email }
      });
    }

    return { success: true, email };
  }
};
