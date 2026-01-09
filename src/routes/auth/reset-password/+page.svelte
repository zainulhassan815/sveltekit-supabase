<script lang="ts">
  import { createClient } from '$lib/supabase/client';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  const supabase = createClient();

  let password = $state('');
  let confirmPassword = $state('');
  let loading = $state(false);
  let error = $state<string | null>(null);
  let success = $state(false);
  let validSession = $state(false);
  let checkingSession = $state(true);

  onMount(async () => {
    // Check if user came from a valid reset link
    const {
      data: { session }
    } = await supabase.auth.getSession();
    validSession = !!session;
    checkingSession = false;
  });

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    error = null;

    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      loading = false;
      return;
    }

    if (password.length < 6) {
      error = 'Password must be at least 6 characters';
      loading = false;
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password
    });

    if (updateError) {
      error = updateError.message;
      loading = false;
      return;
    }

    success = true;
    loading = false;

    // Redirect to dashboard after short delay
    setTimeout(() => {
      goto('/dashboard');
    }, 2000);
  }
</script>

<div class="flex min-h-screen items-center justify-center px-4">
  <div class="w-full max-w-md">
    <div class="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      {#if checkingSession}
        <div class="text-center">
          <svg class="mx-auto h-8 w-8 animate-spin text-indigo-600" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
              fill="none"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p class="mt-2 text-slate-600">Verifying reset link...</p>
        </div>
      {:else if !validSession}
        <div class="text-center">
          <svg
            class="mx-auto h-12 w-12 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 class="mt-2 font-semibold text-slate-900">Invalid or expired link</h3>
          <p class="mt-1 text-sm text-slate-600">
            This password reset link is invalid or has expired.
          </p>
          <a
            href="/auth/forgot-password"
            class="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Request a new link
          </a>
        </div>
      {:else if success}
        <div class="rounded-lg bg-green-50 p-4 text-center">
          <svg
            class="mx-auto mb-2 h-8 w-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="font-semibold text-green-800">Password updated!</h3>
          <p class="mt-1 text-sm text-green-700">Redirecting you to the dashboard...</p>
        </div>
      {:else}
        <div class="mb-6 text-center">
          <h1 class="text-2xl font-bold text-slate-900">Set new password</h1>
          <p class="mt-1 text-slate-600">Enter your new password below</p>
        </div>

        {#if error}
          <div class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        {/if}

        <form onsubmit={handleSubmit} class="space-y-4">
          <div>
            <label for="password" class="mb-1 block text-sm font-medium text-slate-700">
              New Password
            </label>
            <input
              id="password"
              type="password"
              bind:value={password}
              required
              minlength={6}
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="••••••••"
            />
            <p class="mt-1 text-xs text-slate-500">Minimum 6 characters</p>
          </div>

          <div>
            <label for="confirmPassword" class="mb-1 block text-sm font-medium text-slate-700">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              bind:value={confirmPassword}
              required
              minlength={6}
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            class="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {#if loading}
              <span class="inline-flex items-center gap-2">
                <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Updating...
              </span>
            {:else}
              Update password
            {/if}
          </button>
        </form>
      {/if}
    </div>
  </div>
</div>
