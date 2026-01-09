<script lang="ts">
  import { enhance } from '$app/forms';

  let { data, form } = $props();

  let loading = $state(false);
  let deleteLoading = $state(false);
  let showDeleteConfirm = $state(false);
  let showSuccess = $state(false);

  // Show success message when form succeeds
  $effect(() => {
    if (form?.success) {
      showSuccess = true;
      setTimeout(() => {
        showSuccess = false;
      }, 3000);
    }
  });

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  // Derive current status for the select
  let currentStatus = $derived(data.project.status);
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

    <!-- Success Message -->
    {#if showSuccess}
      <div class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
        Project updated successfully!
      </div>
    {/if}

    <div class="rounded-xl border border-slate-200 bg-white p-6">
      <div class="mb-6 flex items-start justify-between">
        <div>
          <h1 class="text-xl font-bold text-slate-900">Edit Project</h1>
          <p class="mt-1 text-sm text-slate-500">
            Created {formatDate(data.project.created_at)}
          </p>
        </div>
        <button
          type="button"
          onclick={() => (showDeleteConfirm = true)}
          class="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          Delete
        </button>
      </div>

      {#if form?.error}
        <div class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {form.error}
        </div>
      {/if}

      <form
        method="POST"
        action="?/update"
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
            value={data.project.name}
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
            >{data.project.description ?? ''}</textarea
          >
          <p class="mt-1 text-xs text-slate-500">Optional. Max 500 characters.</p>
        </div>

        <div>
          <label for="status" class="mb-1 block text-sm font-medium text-slate-700"> Status </label>
          <select
            id="status"
            name="status"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="draft" selected={currentStatus === 'draft'}>Draft</option>
            <option value="active" selected={currentStatus === 'active'}>Active</option>
            <option value="completed" selected={currentStatus === 'completed'}>Completed</option>
            <option value="archived" selected={currentStatus === 'archived'}>Archived</option>
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
                Saving...
              </span>
            {:else}
              Save Changes
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

    <!-- Metadata -->
    <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4">
      <h3 class="mb-2 text-sm font-medium text-slate-700">Project Details</h3>
      <dl class="space-y-1 text-sm">
        <div class="flex justify-between">
          <dt class="text-slate-500">ID</dt>
          <dd class="font-mono text-slate-700">{data.project.id.slice(0, 8)}...</dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-slate-500">Last Updated</dt>
          <dd class="text-slate-700">{formatDate(data.project.updated_at)}</dd>
        </div>
      </dl>
    </div>
  </main>
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
      <h3 class="text-lg font-bold text-slate-900">Delete Project</h3>
      <p class="mt-2 text-sm text-slate-600">
        Are you sure you want to delete "<strong>{data.project.name}</strong>"? This action cannot
        be undone.
      </p>

      <div class="mt-6 flex gap-3">
        <form
          method="POST"
          action="?/delete"
          use:enhance={() => {
            deleteLoading = true;
            return async ({ update }) => {
              deleteLoading = false;
              await update();
            };
          }}
          class="flex-1"
        >
          <button
            type="submit"
            disabled={deleteLoading}
            class="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {#if deleteLoading}
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
                Deleting...
              </span>
            {:else}
              Yes, Delete Project
            {/if}
          </button>
        </form>
        <button
          type="button"
          onclick={() => (showDeleteConfirm = false)}
          class="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
{/if}
