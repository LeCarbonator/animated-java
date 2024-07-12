<script lang="ts" , context="module">
	import NumberSlider from './dialogItems/numberSlider.svelte'
	import LineInput from './dialogItems/lineInput.svelte'

	import { Valuable } from '../util/stores'
	import { translate } from '../util/translation'
</script>

<script lang="ts">
	import Collection from './dialogItems/collection.svelte'
	import Select from './dialogItems/select.svelte'
	import { getAvailableNodes } from '../util/excludedNodes'
	import { getTopLevelNodes } from "../util/getTopLevelNodes"
	import Checkbox from './dialogItems/checkbox.svelte'
	import SelectCollection from './dialogItems/selectCollection.svelte'
	import MultiSelect from './dialogItems/multiSelect.svelte'

	export let animationName: Valuable<string>
	export let loopMode: Valuable<string>
	export let loopDelay: Valuable<number>
	export let keepModelOrigin: Valuable<boolean>
	export let modelOriginNode: Valuable<{ name: string; value: string} | undefined>
	export let modelOriginNodeAxes: Valuable<Array<{ name: string; selected: boolean; tooltip?: string;}>>
	export let excludedNodes: Valuable<Array<{ name: string; value: string }>>

	const availableBones = getAvailableNodes(excludedNodes.get())
	const topLevelBones = getTopLevelNodes()

	// automatically select the top level node if there's only one
	keepModelOrigin.subscribe((enabled) => {
		if (enabled) {
			if (!modelOriginNode.get() || topLevelBones.length === 1) {
				modelOriginNode.set(topLevelBones.at(0))
			}
		} else {
			modelOriginNode.set(undefined);
		}
	})

	function animationNameValueChecker(value: string): { type: string; message: string } {
		if (value.trim().length === 0) {
			return {
				type: 'error',
				message: translate('dialog.animation_properties.animation_name.error.empty'),
			}
		} else if (value.match(/[^a-zA-Z0-9_\.]/)) {
			return {
				type: 'error',
				message: translate(
					'dialog.animation_properties.animation_name.error.invalid_characters',
				),
			}
		}
		return { type: 'success', message: '' }
	}
</script>

<div>
	<LineInput
		label={translate('dialog.animation_properties.animation_name.title')}
		tooltip={translate('dialog.animation_properties.animation_name.description')}
		bind:value={animationName}
		valueChecker={animationNameValueChecker}
	/>

	<Select
		label={translate('dialog.animation_properties.loop_mode.title')}
		tooltip={translate('dialog.animation_properties.loop_mode.description')}
		options={{
			once: translate('dialog.animation_properties.loop_mode.options.once'),
			hold: translate('dialog.animation_properties.loop_mode.options.hold'),
			loop: translate('dialog.animation_properties.loop_mode.options.loop'),
		}}
		defaultOption={'once'}
		bind:value={loopMode}
	/>

	<NumberSlider
		label={translate('dialog.animation_properties.loop_delay.title')}
		tooltip={translate('dialog.animation_properties.loop_delay.description')}
		min={0}
		bind:value={loopDelay}
	/>

	<Checkbox
		label={translate('dialog.animation_properties.keep_model_origin.title')}
		tooltip={translate('dialog.animation_properties.keep_model_origin.description')}
		bind:checked={keepModelOrigin}
	/>

	{#if $keepModelOrigin}
		<SelectCollection
			label={translate('animated_java.dialog.animation_properties.model_origin_node.title')}
			tooltip={translate('animated_java.dialog.animation_properties.model_origin_node.description')}
			items={topLevelBones}
			bind:selectedItem={modelOriginNode}
		/>
		<MultiSelect 
		label={"Enabled Axes"} 
		tooltip={"Enabled Axes"} 
		selection={modelOriginNodeAxes}
		/>
	{/if}

	<Collection
		label={translate('dialog.animation_properties.excluded_nodes.title')}
		tooltip={translate('dialog.animation_properties.bone_lists.description')}
		availableItemsColumnLable={translate('dialog.animation_properties.included_nodes.title')}
		availableItemsColumnTooltip={translate(
			'dialog.animation_properties.included_nodes.description',
		)}
		includedItemsColumnLable={translate('dialog.animation_properties.excluded_nodes.title')}
		includedItemsColumnTooltip={translate(
			'dialog.animation_properties.excluded_nodes.description',
		)}
		swapColumnsButtonTooltip={translate(
			'dialog.animation_properties.swap_columns_button.tooltip',
		)}
		availableItems={availableBones}
		bind:includedItems={excludedNodes}
	/>
</div>

<style>
</style>
