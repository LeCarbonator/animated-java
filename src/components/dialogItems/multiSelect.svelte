<script lang="ts">
	import { Valuable } from '../../util/stores'
	import BaseDialogItem from './baseDialogItem.svelte'

	export let label: string
	export let tooltip: string = ''
	//export let options: Record<string, string>
	// export let defaultSelection: string[]
	export let selection: Valuable<Array<{ name: string; selected: boolean; tooltip?: string; }>>
</script>

<BaseDialogItem {label} {tooltip}>
	<div class="dialog_bar form_bar checkbox_bar">
		<label id="multi_select_label" class="name_space_left" for="export">{label}</label>
		<div class="spacer" />
		<div id="export">
			{#each $selection as { name, selected, tooltip = "" }, i}
					<label for={`${label}_${i}`}>{name}</label>
					<input 
					type="checkbox"
					title={tooltip}
					class="focusable_input" 
					id={`${label}_${i}`} 
					bind:checked={selected} 
					/>
			{/each}
		</div>
	</div>
</BaseDialogItem>

<style>
	.checkbox_bar {
		flex-direction: row;
		align-items: center;
	}
	.spacer {
		flex-grow: 1;
		border-bottom: 2px dashed var(--color-button);
		height: 0px;
		margin: 8px;
		margin-left: 16px;
	}
	label#multi_select_label {
		width: auto;
	}
</style>
