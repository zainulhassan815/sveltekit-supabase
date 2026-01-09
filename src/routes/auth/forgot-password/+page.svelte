<script lang="ts">
  import { createClient } from '$lib/supabase/client';

  const supabase = createClient();

  let email = $state('');
  let loading = $state(false);
  let error = $state<string | null>(null);
  let success = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    error = null;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });

    if (resetError) {
      error = resetError.message;
      loading = false;
      return;
    }

    success = true;
    loading = false;
  }
</script>

<div class="flex min-h-screen items-center justify-center px-4">
  <div class="w-full max-w-md">
    <div class="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-bold text-slate-900">Reset your password</h1>
        <p class="mt-1 text-slate-600">We'll send you a link to reset it</p>
      </div>

      {#if success}
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h3 class="font-semibold text-green-800">Check your email</h3>
          <p class="mt-1 text-sm text-green-700">
            If an account exists for <strong>{email}</strong>, you'll receive a password reset link.
          </p>
        </div>

        <p class="mt-6 text-center text-sm text-slate-600">
          <a href="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            Back to sign in
          </a>
        </p>
      {:else}
        {#if error}
          <div class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        {/if}

        <form onsubmit={handleSubmit} class="space-y-4">
          <div>
            <label for="email" class="mb-1 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              bind:value={email}
              required
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="you@example.com"
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
                Sending...
              </span>
            {:else}
              Send reset link
            {/if}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-slate-600">
          Remember your password?
          <a href="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </a>
        </p>
      {/if}
    </div>
  </div>
</div>
