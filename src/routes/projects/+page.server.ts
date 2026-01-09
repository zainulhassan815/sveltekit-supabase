import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await locals.safeGetSession();

  // Get filter from query params
  const statusFilter = url.searchParams.get('status') as
    | 'draft'
    | 'active'
    | 'completed'
    | 'archived'
    | null;
  const validStatuses = ['draft', 'active', 'completed', 'archived'] as const;

  // Build query with RLS (automatically filters by user_id)
  let query = locals.supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  // Apply status filter if provided
  if (statusFilter && validStatuses.includes(statusFilter)) {
    query = query.eq('status', statusFilter);
  }

  const { data: projects, error } = await query;

  if (error) {
    console.error('Error fetching projects:', error);
  }

  return {
    user,
    projects: projects ?? [],
    currentFilter: statusFilter
  };
};
