import { Comment, Slot } from 'vue';

/**
 * Capitalizes the first letter of a string
 *
 * @param {String} str - The string to capitalize
 *
 * @returns {String} The capitalized string
 */
export function capitalize(str: string): string {
	const lowercase = str.toLowerCase();
	return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
}

/**
 * Checks if a slot has content to be rendered (not empty)
 * @see https://github.com/vuejs/core/issues/4733#issuecomment-1244011992
 *
 * @param {Slot} slot - The slot to check
 * @param {any} slotProps - The props to pass to the slot
 *
 * @returns {boolean} True if the slot has content, false otherwise
 */
export function hasSlotContent(slot?: Slot, slotProps: any = {}): boolean {
	if (!slot) return false;

	return slot(slotProps).some((vnode) => {
		if (Array.isArray(vnode.children)) {
			return !!vnode.children.length;
		}

		return vnode.type !== Comment;
	});
}