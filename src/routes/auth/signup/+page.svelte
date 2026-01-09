<script lang="ts">
  import { enhance } from '$app/forms';
  import OAuthButtons from '$lib/components/OAuthButtons.svelte';

  let { form } = $props();

  let loading = $state(false);
</script>

<div class="flex min-h-screen items-center justify-center px-4">
  <div class="w-full max-w-md">
    <div class="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-bold text-slate-900">Create an account</h1>
        <p class="mt-1 text-slate-600">Get started for free</p>
      </div>

      {#if form?.success}
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
          <h3 class="font-semibold text-green-800">Check your email</h3>
          <p class="mt-1 text-sm text-green-700">
            We've sent you a confirmation link to <strong>{form.email}</strong>
          </p>
        </div>

        <p class="mt-6 text-center text-sm text-slate-600">
          <a href="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            Back to sign in
          </a>
        </p>
      {:else}
        {#if form?.error}
          <div class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {form.error}
          </div>
        {/if}

        <form
          method="POST"
          use:enhance={() => {
            loading = true;
            return async ({ update }) => {
              loading = false;
              await update();
            };
          }}
          class="space-y-4"
        >
          <div>
            <label for="email" class="mb-1 block text-sm font-medium text-slate-700"> Email </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form?.values?.email ?? ''}
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label for="password" class="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minlength={6}
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="••••••••"
            />
            <p class="mt-1 text-xs text-slate-500">Minimum 6 characters</p>
          </div>

          <div>
            <label for="confirmPassword" class="mb-1 block text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
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
                Creating account...
              </span>
            {:else}
              Create account
            {/if}
          </button>
        </form>

        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-white px-2 text-slate-500">Or continue with</span>
          </div>
        </div>

        <OAuthButtons />

        <p class="mt-6 text-center text-sm text-slate-600">
          Already have an account?
          <a href="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </a>
        </p>
      {/if}
    </div>
  </div>
</div>
