import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { TablesUpdate } from '$lib/database.types';

/**
 * GET /api/projects/:id
 * Fetch a single project by ID
 */
export const GET: RequestHandler = async ({ locals, params }) => {
  const { user } = await locals.safeGetSession();

  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: project, error } = await locals.supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !project) {
    return json({ error: 'Project not found' }, { status: 404 });
  }

  return json({ project });
};

/**
 * PATCH /api/projects/:id
 * Update a project
 */
export const PATCH: RequestHandler = async ({ locals, params, request }) => {
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
  const updates: TablesUpdate<'projects'> = {};

  // Validate and add fields to update
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return json({ error: 'Project name cannot be empty' }, { status: 400 });
    }
    if (name.length > 100) {
      return json({ error: 'Project name must be less than 100 characters' }, { status: 400 });
    }
    updates.name = name.trim();
  }

  if (description !== undefined) {
    if (description && description.length > 500) {
      return json({ error: 'Description must be less than 500 characters' }, { status: 400 });
    }
    updates.description = description?.trim() || null;
  }

  if (status !== undefined) {
    const validStatuses = ['draft', 'active', 'completed', 'archived'] as const;
    if (!validStatuses.includes(status)) {
      return json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }
    updates.status = status;
  }

  if (Object.keys(updates).length === 0) {
    return json({ error: 'No valid fields to update' }, { status: 400 });
  }

  // Update project - RLS ensures user can only update their own
  const { data: project, error } = await locals.supabase
    .from('projects')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return json({ error: 'Project not found' }, { status: 404 });
    }
    console.error('Error updating project:', error);
    return json({ error: 'Failed to update project' }, { status: 500 });
  }

  return json({ project });
};

/**
 * DELETE /api/projects/:id
 * Delete a project
 */
export const DELETE: RequestHandler = async ({ locals, params }) => {
  const { user } = await locals.safeGetSession();

  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  // First check if project exists (RLS will filter)
  const { data: existing } = await locals.supabase
    .from('projects')
    .select('id')
    .eq('id', params.id)
    .single();

  if (!existing) {
    return json({ error: 'Project not found' }, { status: 404 });
  }

  const { error } = await locals.supabase.from('projects').delete().eq('id', params.id);

  if (error) {
    console.error('Error deleting project:', error);
    return json({ error: 'Failed to delete project' }, { status: 500 });
  }

  return json({ success: true }, { status: 200 });
};
