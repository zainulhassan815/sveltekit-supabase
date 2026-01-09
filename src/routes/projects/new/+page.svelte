<script lang="ts">
  import { enhance } from '$app/forms';

  let { data, form } = $props();

  let loading = $state(false);
</script>

<div class="min-h-screen">
  <!-- Navigation -->
  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      <a href="/" class="text-xl font-bold text-slate-900"> SvelteKit + Supabase </a>
      <nav class="flex items-center gap-6">
        <a href="/dashboard" class="text-sm font-medium text-slate-600 hover:text-slate-900"
          >Dashboard</a
        >
        <a href="/projects" class="text-sm font-medium text-indigo-600">Projects</a>
        <div class="flex items-center gap-3">
          <span class="text-sm text-slate-600">{data.user?.email}</span>
          <form method="POST" action="/auth/logout">
            <button
              type="submit"
              class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>
    </div>
  </header>

  <!-- Main Content -->
  <main class="mx-auto max-w-2xl px-4 py-8">
    <!-- Back Link -->
    <a
      href="/projects"
      class="mb-6 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Projects
    </a>

    <div class="rounded-xl border border-slate-200 bg-white p-6">
      <h1 class="mb-6 text-xl font-bold text-slate-900">Create New Project</h1>

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
          <label for="name" class="mb-1 block text-sm font-medium text-slate-700">
            Project Name <span class="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxlength={100}
            value={form?.name ?? ''}
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="My Awesome Project"
          />
        </div>

        <div>
          <label for="description" class="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            maxlength={500}
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="What is this project about?">{form?.description ?? ''}</textarea
          >
          <p class="mt-1 text-xs text-slate-500">Optional. Max 500 characters.</p>
        </div>

        <div>
          <label for="status" class="mb-1 block text-sm font-medium text-slate-700">
            Initial Status
          </label>
          <select
            id="status"
            name="status"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="draft" selected={form?.status === 'draft' || !form?.status}>Draft</option
            >
            <option value="active" selected={form?.status === 'active'}>Active</option>
          </select>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            class="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {#if loading}
              <span class="inline-flex items-center justify-center gap-2">
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
                Creating...
              </span>
            {:else}
              Create Project
            {/if}
          </button>
          <a
            href="/projects"
            class="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  </main>
</div>
