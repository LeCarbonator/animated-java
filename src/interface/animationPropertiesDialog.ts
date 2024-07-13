import AniamtionPropertiesSvelteComponent from '../components/animationProperties.svelte'
import { PACKAGE } from '../constants'
import { Valuable } from '../util/stores'
import { SvelteDialog } from '../util/svelteDialog'
import { translate } from '../util/translation'

export const DIALOG_ID = `${PACKAGE.name}:animationPropertiesDialog`

export function openAnimationPropertiesDialog(animation: _Animation) {
	const animationName = new Valuable(animation.name)
	const loopMode = new Valuable(animation.loop as string)
	const loopDelay = new Valuable(Number(animation.loop_delay) || 0)
	const excludedNodes = new Valuable(animation.excluded_nodes)
	const keepModelOrigin = new Valuable((animation.model_origin_node?.name?.length ?? 0) > 0)
	const modelOriginNode = new Valuable(animation.model_origin_node)

	const { x = true, y = true, z = true } = animation.model_origin_node?.enabled_axes ?? {}
	const modelOriginNodeAxes = new Valuable([
		{
			name: 'X',
			tooltip: translate('animated_java.dialog.animation_properties.enabled_axes.x'),
			selected: x,
		},
		{
			name: 'Y',
			tooltip: translate('animated_java.dialog.animation_properties.enabled_axes.y'),
			selected: y,
		},
		{
			name: 'Z',
			tooltip: translate('animated_java.dialog.animation_properties.enabled_axes.z'),
			selected: z,
		},
	])

	new SvelteDialog({
		id: DIALOG_ID,
		title: translate('dialog.animation_properties.title', animation.name),
		width: 600,
		component: AniamtionPropertiesSvelteComponent,
		props: {
			animationName,
			loopMode,
			loopDelay,
			excludedNodes,
			keepModelOrigin,
			modelOriginNode,
			modelOriginNodeAxes,
		},
		preventKeybinds: true,
		onConfirm() {
			animation.name = animationName.get()
			animation.createUniqueName(Blockbench.Animation.all)
			animation.loop = loopMode.get() as any
			animation.loop_delay = loopDelay.get().toString()
			animation.excluded_nodes = excludedNodes.get()
			if (keepModelOrigin.get()) {
				animation.model_origin_node = modelOriginNode.get() ?? {}
				const [axisX, axisY, axisZ] = modelOriginNodeAxes.get()

				animation.model_origin_node.enabled_axes = {
					x: axisX.selected,
					y: axisY.selected,
					z: axisZ.selected,
				}
			} else {
				animation.model_origin_node = {}
			}
		},
	}).show()
}
