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

		loadScript(
			'https://cdn.jsdelivr.net/gh/supertokens/prebuiltui@v0.47.0/build/static/js/main.8f01ace8.js'
		);
	});
</script>

<div id="supertokensui" />
