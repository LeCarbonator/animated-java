<script lang="ts" context="module">
	import { Valuable } from '../../util/stores'
	import { SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action'
	import BaseDialogItem from './baseDialogItem.svelte'
	import { flip } from 'svelte/animate'
	import { fade } from 'svelte/transition'
	import { cubicIn } from 'svelte/easing'
</script>

<script lang="ts">
	// An editable list of unique items, with a button to add new items from a list of options.
	export let label: string
	export let tooltip: string
	export let items: CollectionItem[]
	export let selectedItem: Valuable<CollectionItem | undefined>

	let itemsList: { id: number; title: string; selected: boolean; value: string; icon?: string, [key: string]: any }[] = []

	for (let i = 0; i < items.length; i++) {
		const item = items[i]
		itemsList.push({ 
			id: i, 
			title: item.name, 
			icon: item.icon, 
			selected: selectedItem.get()?.value === item.value,
			value: item.value
		})
	}

	function handleSelect(value: string) {
		const selected = items.find(i => i.value === value);
		if (selected) {
			selectedItem.set(selected)
			itemsList = itemsList
		}
	}
</script>

<BaseDialogItem {label} {tooltip}>
	<div class="main-column-container">
		<div class="column">
			<h3>{label}</h3>
			<section
				class="column sub-column-container"
			>
				{#each itemsList as item (item.id)}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div 
						class="list-item" animate:flip={{ duration: 150 }} 
						class:selected={selectedItem.get()?.value === item.value}
						on:click|preventDefault={() => handleSelect(item.value)}
					>
						{#if item[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
							<div
								style="visibility: visible !important; border-bottom: 2px solid var(--color-accent); width: 100%; height: 50%;"
								in:fade={{ duration: 150, easing: cubicIn }}
							></div>
						{/if}
						<i
							class="material-icons notranslate icon"
							style="color: rgb(162, 235, 255);">{item.icon || 'folder'}</i
						>
						<span>{item.title}</span>
					</div>
				{/each}
			</section>
		</div>

	</div>
</BaseDialogItem>

<style>
	.main-column-container {
		display: flex;
		justify-content: space-around;
	}
	section.sub-column-container {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		width: unset;
		height: 100%;
		background-color: var(--color-back);
		border: 1px solid var(--color-border);
		margin: 8px;
		margin-top: 0px;
		padding: 4px 8px 30px;
		max-height: 16rem;
		overflow-y: auto;
	}
	h3 {
		text-align: center;
		font-size: 16px;
		padding: 0px;
		margin: 8px 0px;
	}
	.selected {
		background-color: var(--color-selected);
	}
	.column {
		display: flex;
		flex-direction: column;
		width: 50%;
	}
	.list-item {
		display: flex;
		cursor: default !important;
		width: 100%;
	}
	span {
		/* background-color: var(--color-button); */
		/* border-bottom: 2px solid var(--color-dark); */
		/* margin: 0 8px 6px 8px; */
		padding: 0 8px;
	}
	span:hover {
		color: var(--color-light);
	}
</style>
