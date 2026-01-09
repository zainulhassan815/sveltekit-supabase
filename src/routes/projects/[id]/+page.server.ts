import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { TablesUpdate } from '$lib/database.types';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await locals.safeGetSession();

  // Fetch project - RLS ensures user can only access their own projects
  const { data: project, error: fetchError } = await locals.supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .single();

  if (fetchError || !project) {
    throw error(404, 'Project not found');
  }

  return {
    user,
    project
  };
};

export const actions: Actions = {
  update: async ({ request, locals, params }) => {
    const { user } = await locals.safeGetSession();

    if (!user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as 'draft' | 'active' | 'completed' | 'archived';

    // Server-side validation
    if (!name || name.trim().length === 0) {
      return fail(400, { error: 'Project name is required' });
    }

    if (name.length > 100) {
      return fail(400, { error: 'Project name must be less than 100 characters' });
    }

    if (description && description.length > 500) {
      return fail(400, { error: 'Description must be less than 500 characters' });
    }

    // Update project - RLS ensures user can only update their own projects
    const updateData: TablesUpdate<'projects'> = {
      name: name.trim(),
      description: description?.trim() || null,
      status
    };

    const { error: updateError } = await locals.supabase
      .from('projects')
      .update(updateData)
      .eq('id', params.id);

    if (updateError) {
      console.error('Error updating project:', updateError);
      return fail(500, { error: 'Failed to update project. Please try again.' });
    }

    return { success: true };
  },

  delete: async ({ locals, params }) => {
    const { user } = await locals.safeGetSession();

    if (!user) {
      return fail(401, { error: 'Unauthorized' });
    }

    // Delete project - RLS ensures user can only delete their own projects
    const { error: deleteError } = await locals.supabase
      .from('projects')
      .delete()
      .eq('id', params.id);

    if (deleteError) {
      console.error('Error deleting project:', deleteError);
      return fail(500, { error: 'Failed to delete project. Please try again.' });
    }

    throw redirect(303, '/projects');
  }
};
