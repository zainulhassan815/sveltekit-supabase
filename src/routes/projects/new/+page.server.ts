import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { TablesInsert } from '$lib/database.types';

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = await locals.safeGetSession();
  return { user };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const { user } = await locals.safeGetSession();

    if (!user) {
      return fail(401, {
        error: 'Unauthorized',
        name: '',
        description: '',
        status: 'draft' as const
      });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as 'draft' | 'active';

    // Server-side validation
    if (!name || name.trim().length === 0) {
      return fail(400, {
        error: 'Project name is required',
        name,
        description,
        status
      });
    }

    if (name.length > 100) {
      return fail(400, {
        error: 'Project name must be less than 100 characters',
        name,
        description,
        status
      });
    }

    if (description && description.length > 500) {
      return fail(400, {
        error: 'Description must be less than 500 characters',
        name,
        description,
        status
      });
    }

    // Insert project - RLS ensures user can only create their own projects
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
      return fail(500, {
        error: 'Failed to create project. Please try again.',
        name,
        description,
        status
      });
    }

    throw redirect(303, `/projects/${project.id}`);
  }
};
