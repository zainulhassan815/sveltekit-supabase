import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  return {
    redirectTo: url.searchParams.get('redirectTo') || '/dashboard'
  };
};

export const actions: Actions = {
  default: async ({ request, locals, url }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';

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

    const { error } = await locals.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return fail(400, {
        error: error.message,
        values: { email }
      });
    }

    throw redirect(303, redirectTo);
  }
};
