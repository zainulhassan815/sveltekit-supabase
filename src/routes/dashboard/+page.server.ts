import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.safeGetSession();

  // Example: Fetch user's projects from Supabase
  // This would use RLS to automatically filter by user_id
  const { data: projects } = await locals.supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    user,
    projects: projects ?? []
  };
};
