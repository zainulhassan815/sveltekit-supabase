<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { invalidate } from '$app/navigation';
  import { createClient } from '$lib/supabase/client';

  let { children, data } = $props();

  // Create browser client once
  const supabase = createClient();

  onMount(() => {
    // Listen for auth state changes and invalidate data
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        invalidate('supabase:auth');
      }
    });

    return () => subscription.unsubscribe();
  });
</script>

<svelte:head>
  <title>SvelteKit + Supabase Demo</title>
  <meta name="description" content="Production-ready SvelteKit with Supabase Auth" />
</svelte:head>

<div class="min-h-screen bg-slate-50">
  {@render children()}
</div>
