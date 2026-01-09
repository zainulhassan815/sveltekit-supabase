import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { TablesInsert } from '$lib/database.types';

/**
 * GET /api/projects
 * Fetch all projects for the authenticated user
 * Supports query params: status, limit, offset
 */
export const GET: RequestHandler = async ({ locals, url }) => {
  const { user } = await locals.safeGetSession();

  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse query parameters
  const status = url.searchParams.get('status') as
    | 'draft'
    | 'active'
    | 'completed'
    | 'archived'
    | null;
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  // Build query with RLS
  let query = locals.supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Apply status filter if valid
  if (status && ['draft', 'active', 'completed', 'archived'].includes(status)) {
    query = query.eq('status', status);
  }

  const { data: projects, error, count } = await query;

  if (error) {
    console.error('Error fetching projects:', error);
    return json({ error: 'Failed to fetch projects' }, { status: 500 });
  }

  return json({
    projects,
    pagination: {
      total: count,
      limit,
      offset,
      hasMore: (count ?? 0) > offset + limit
    }
  });
};

/**
 * POST /api/projects
 * Create a new project
 */
export const POST: RequestHandler = async ({ locals, request }) => {
  const { user } = await locals.safeGetSession();

  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, description, status } = body;

  // Validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'Project name is required' }, { status: 400 });
  }

  if (name.length > 100) {
    return json({ error: 'Project name must be less than 100 characters' }, { status: 400 });
  }

  if (description && description.length > 500) {
    return json({ error: 'Description must be less than 500 characters' }, { status: 400 });
  }

  const validStatuses = ['draft', 'active', 'completed', 'archived'] as const;
  if (status && !validStatuses.includes(status)) {
    return json(
      { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
      { status: 400 }
    );
  }

  // Create project
  const insertData: TablesInsert<'projects'> = {
    user_id: user.id,
    name: name.trim(),
    description: description?.trim() || null,
    status: status || 'draft'
  };

  const { data: project, error } = await locals.supabase
    .from('projects')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return json({ error: 'Failed to create project' }, { status: 500 });
  }

  return json({ project }, { status: 201 });
};
