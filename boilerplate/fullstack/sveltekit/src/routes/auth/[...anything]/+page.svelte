<script lang="ts">
	import { onMount } from 'svelte';
	import { initSuperTokensUI } from '../../../config/frontend';

	onMount(() => {
		const loadScript = (src: string) => {
			const script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = src;
			script.id = 'supertokens-script';
			script.onload = () => {
				initSuperTokensUI();
			};
			document.body.appendChild(script);
		};

		loadScript("${jsdeliveryprebuiltuiurl}")
	});
</script>

<div id="supertokensui" />
