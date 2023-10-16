import { onMounted, onUnmounted, Ref, ref } from 'vue';

/**
 * Adds a class to the header when it's stuck (sticky affects) to the top of the screen.
 * @param element The element to observe.
 */
export function useStickyObserver(element: HTMLElement | Ref<HTMLElement | undefined>) {
	const $element = ref(element);
	
	// More info: https://css-tricks.com/how-to-detect-when-a-sticky-element-gets-pinned/
	let observer: IntersectionObserver;
	onMounted(() => {
		observer = new IntersectionObserver(
			([e]) => e.target.classList.toggle('stuck', e.intersectionRatio < 1),
			{ threshold: [1] },
		);
		
		if ($element.value) {
			observer.observe($element.value);
		}
	});
	
	onUnmounted(() => {
		if ($element.value) {
			observer.unobserve($element.value);
		}
	});
}