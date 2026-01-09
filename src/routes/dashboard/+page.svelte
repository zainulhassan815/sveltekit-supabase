<script lang="ts">
  import type { Tables } from '$lib/database.types';

  let { data } = $props();

  // Reactive reference to projects from server load
  let projects = $derived(data.projects as Tables<'projects'>[]);
</script>

<div class="min-h-screen">
  <!-- Navigation -->
  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      <a href="/" class="text-xl font-bold text-slate-900"> SvelteKit + Supabase </a>
      <nav class="flex items-center gap-6">
        <a href="/dashboard" class="text-sm font-medium text-indigo-600">Dashboard</a>
        <a href="/projects" class="text-sm font-medium text-slate-600 hover:text-slate-900"
          >Projects</a
        >
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
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900">Welcome back!</h1>
      <p class="mt-1 text-slate-600">Here's what's happening with your projects.</p>
    </div>

    <!-- Stats Grid -->
    <div class="mb-8 grid gap-4 sm:grid-cols-3">
      <div class="rounded-xl border border-slate-200 bg-white p-6">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
            <svg
              class="h-5 w-5 text-indigo-600"
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
          </div>
          <div>
            <p class="text-sm text-slate-600">Total Projects</p>
            <p class="text-2xl font-bold text-slate-900">{projects.length}</p>
          </div>
        </div>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-6">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <svg
              class="h-5 w-5 text-green-600"
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
          </div>
          <div>
            <p class="text-sm text-slate-600">Active</p>
            <p class="text-2xl font-bold text-slate-900">
              {projects.filter((p) => p.status === 'active').length}
            </p>
          </div>
        </div>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-6">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
            <svg
              class="h-5 w-5 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-slate-600">Draft</p>
            <p class="text-2xl font-bold text-slate-900">
              {projects.filter((p) => p.status === 'draft').length}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Projects -->
    <div class="rounded-xl border border-slate-200 bg-white">
      <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <h2 class="font-semibold text-slate-900">Recent Projects</h2>
        <a href="/projects/new" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          + New Project
        </a>
      </div>
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
          <h3 class="mt-2 text-sm font-medium text-slate-900">No projects yet</h3>
          <p class="mt-1 text-sm text-slate-500">Get started by creating your first project.</p>
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
            <li class="px-6 py-4 transition-colors hover:bg-slate-50">
              <a href="/projects/{project.id}" class="block">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-slate-900">{project.name}</h3>
                    {#if project.description}
                      <p class="mt-0.5 text-sm text-slate-500">{project.description}</p>
                    {/if}
                  </div>
                  <span
                    class="rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
										{project.status === 'active' ? 'bg-green-100 text-green-700' : ''}
										{project.status === 'draft' ? 'bg-amber-100 text-amber-700' : ''}
										{project.status === 'completed' ? 'bg-blue-100 text-blue-700' : ''}
										{project.status === 'archived' ? 'bg-slate-100 text-slate-600' : ''}"
                  >
                    {project.status}
                  </span>
                </div>
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </main>
</div>
