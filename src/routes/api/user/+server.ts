import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { TablesUpdate } from '$lib/database.types';

/**
 * GET /api/user
 * Get current authenticated user info
 */
export const GET: RequestHandler = async ({ locals }) => {
  const { user, session } = await locals.safeGetSession();

  if (!user || !session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch profile data
  const { data: profile } = await locals.supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return json({
    user: {
      id: user.id,
      email: user.email,
      fullName: profile?.full_name ?? null,
      avatarUrl: profile?.avatar_url ?? null,
      createdAt: profile?.created_at ?? null
    }
  });
};

/**
 * PATCH /api/user
 * Update current user's profile
 */
export const PATCH: RequestHandler = async ({ locals, request }) => {
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

  const { fullName, avatarUrl } = body;
  const updates: TablesUpdate<'profiles'> = {};

  if (fullName !== undefined) {
    if (fullName && fullName.length > 100) {
      return json({ error: 'Full name must be less than 100 characters' }, { status: 400 });
    }
    updates.full_name = fullName?.trim() || null;
  }

  if (avatarUrl !== undefined) {
    if (avatarUrl && avatarUrl.length > 500) {
      return json({ error: 'Avatar URL is too long' }, { status: 400 });
    }
    updates.avatar_url = avatarUrl?.trim() || null;
  }

  if (Object.keys(updates).length === 0) {
    return json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const { data: profile, error } = await locals.supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return json({ error: 'Failed to update profile' }, { status: 500 });
  }

  return json({
    user: {
      id: user.id,
      email: user.email,
      fullName: profile?.full_name ?? null,
      avatarUrl: profile?.avatar_url ?? null
    }
  });
};
