<script lang="ts">
  import type { Tables } from '$lib/database.types';

  let { data } = $props();

  let projects = $derived(data.projects as Tables<'projects'>[]);

  const statuses = ['all', 'draft', 'active', 'completed', 'archived'] as const;

  function getStatusClasses(status: string) {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-amber-100 text-amber-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'archived':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
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
  <main class="mx-auto max-w-6xl px-4 py-8">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Projects</h1>
        <p class="mt-1 text-slate-600">Manage and organize your projects</p>
      </div>
      <a
        href="/projects/new"
        class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        New Project
      </a>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex gap-2">
      {#each statuses as status}
        {@const isActive =
          (status === 'all' && !data.currentFilter) || data.currentFilter === status}
        <a
          href={status === 'all' ? '/projects' : `/projects?status=${status}`}
          class="rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors
						{isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
        >
          {status}
        </a>
      {/each}
    </div>

    <!-- Projects List -->
    <div class="rounded-xl border border-slate-200 bg-white">
      {#if projects.length === 0}
        <div class="px-6 py-12 text-center">
          <svg
            class="mx-auto h-12 w-12 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-slate-900">No projects found</h3>
          <p class="mt-1 text-sm text-slate-500">
            {#if data.currentFilter}
              No {data.currentFilter} projects. Try a different filter or create a new project.
            {:else}
              Get started by creating your first project.
            {/if}
          </p>
          <a
            href="/projects/new"
            class="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Project
          </a>
        </div>
      {:else}
        <ul class="divide-y divide-slate-200">
          {#each projects as project}
            <li class="transition-colors hover:bg-slate-50">
              <a href="/projects/{project.id}" class="block px-6 py-4">
                <div class="flex items-center justify-between">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-3">
                      <h3 class="truncate font-medium text-slate-900">{project.name}</h3>
                      <span
                        class="rounded-full px-2.5 py-0.5 text-xs font-medium capitalize {getStatusClasses(
                          project.status
                        )}"
                      >
                        {project.status}
                      </span>
                    </div>
                    {#if project.description}
                      <p class="mt-1 truncate text-sm text-slate-500">{project.description}</p>
                    {/if}
                  </div>
                  <div class="ml-4 flex items-center gap-4">
                    <span class="text-sm text-slate-400">{formatDate(project.created_at)}</span>
                    <svg
                      class="h-5 w-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </main>
</div>
