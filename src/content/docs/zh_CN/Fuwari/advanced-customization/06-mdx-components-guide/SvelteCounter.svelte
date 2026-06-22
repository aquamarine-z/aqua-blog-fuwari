<script>
let count = 0;
function increment() {
	count += 1;
}
</script>

<div class="p-4 border-2 border-orange-500 rounded-xl bg-orange-500/10 mb-4">
  <h3 class="text-orange-600 font-bold mb-2">🔥 Svelte Counter (Interactive)</h3>
  <p class="mb-4 text-sm opacity-80">This component is built with Svelte and hydrated via <code class="text-orange-500">client:load</code>.</p>
  <button 
    class="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors active:scale-95"
    on:click={increment}
  >
    Svelte Count: {count}
  </button>
</div>
