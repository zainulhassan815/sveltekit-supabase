<script lang="ts">
  let { data } = $props();
</script>

<div class="flex min-h-screen flex-col">
  <!-- Header -->
  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      <a href="/" class="text-xl font-bold text-slate-900"> SvelteKit + Supabase </a>
      <nav class="flex items-center gap-4">
        {#if data.user}
          <a
            href="/dashboard"
            class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Dashboard
          </a>
        {:else}
          <a
            href="/auth/login"
            class="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Login
          </a>
          <a
            href="/auth/signup"
            class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Get Started
          </a>
        {/if}
      </nav>
    </div>
  </header>

  <!-- Hero Section -->
  <main class="flex flex-1 flex-col items-center justify-center px-4">
    <div class="max-w-2xl text-center">
      <h1 class="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Production-Ready
        <span class="text-indigo-600">SvelteKit + Supabase</span>
      </h1>
      <p class="mb-8 text-lg text-slate-600">
        A complete authentication flow with SSR, TypeScript, and Row-Level Security patterns. Built
        to demonstrate production-ready architecture.
      </p>

      <div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        {#if data.user}
          <a
            href="/dashboard"
            class="rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Go to Dashboard
          </a>
        {:else}
          <a
            href="/auth/signup"
            class="rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Get Started Free
          </a>
          <a
            href="/auth/login"
            class="rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Sign In
          </a>
        {/if}
      </div>
    </div>

    <!-- Features -->
    <div class="mt-16 grid max-w-4xl gap-8 sm:grid-cols-3">
      <div class="text-center">
        <div
          class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100"
        >
          <svg
            class="h-6 w-6 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h3 class="mb-1 font-semibold text-slate-900">Secure Auth</h3>
        <p class="text-sm text-slate-600">JWT validation on server, RLS-ready patterns</p>
      </div>
      <div class="text-center">
        <div
          class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100"
        >
          <svg
            class="h-6 w-6 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"
            />
          </svg>
        </div>
        <h3 class="mb-1 font-semibold text-slate-900">SSR + CSR</h3>
        <p class="text-sm text-slate-600">Proper server/client boundaries</p>
      </div>
      <div class="text-center">
        <div
          class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100"
        >
          <svg
            class="h-6 w-6 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        </div>
        <h3 class="mb-1 font-semibold text-slate-900">Type-Safe</h3>
        <p class="text-sm text-slate-600">End-to-end TypeScript with strict mode</p>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-slate-200 bg-white py-6">
    <p class="text-center text-sm text-slate-500">
      Built by <a href="https://github.com/zainulhassan815" class="text-indigo-600 hover:underline"
        >Zain ul Hassan</a
      >
    </p>
  </footer>
</div>
