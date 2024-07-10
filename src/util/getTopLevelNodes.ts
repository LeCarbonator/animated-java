import { TextDisplay } from '../outliner/textDisplay'
import { VanillaBlockDisplay } from '../outliner/vanillaBlockDisplay'
import { VanillaItemDisplay } from '../outliner/vanillaItemDisplay'

export function getTopLevelNodes(): CollectionItem[] {
	const allNodes: Array<
		Group | Locator | TextDisplay | VanillaItemDisplay | VanillaBlockDisplay | OutlinerElement
	> = []

	allNodes.push(...Group.all.filter(g => g.children.length > 0 && g.parent === 'root'))

	allNodes.push(
		...[
			...Locator.all,
			...TextDisplay.all,
			...VanillaItemDisplay.all,
			...VanillaBlockDisplay.all,
			...(OutlinerElement.types.camera?.all || []),
		].filter(node => node.parent === 'root')
	)

	const topLevelNodes = allNodes.map(node => {
		let icon: string
		switch (true) {
			case node instanceof Group:
				icon = 'folder'
				break
			case node instanceof Locator:
				icon = 'anchor'
				break
			case node instanceof TextDisplay:
			case node instanceof VanillaItemDisplay:
			case node instanceof VanillaBlockDisplay:
				icon = node.icon
				break
			case node instanceof OutlinerElement.types.camera:
				icon = 'videocam'
				break
			default:
				icon = 'close'
				break
		}

		return { icon, name: node.name, value: node.uuid }
	})

	return topLevelNodes
}
