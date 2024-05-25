import type { Slot } from 'vue';
import { Comment } from 'vue';

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 *
 * @returns {string} The capitalized string
 */
export function capitalize(str: string): string {
	const lowercase = str.toLowerCase();
	return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
}

/**
 * Capitalizes the first letter of each word in a string
 * @param {string} str - The string to capitalize
 *
 * @returns {string} The capitalized string
 */
export function capitalizeAll(str: string): string {
	return str
		.split(' ')
		.map(word => capitalize(word))
		.join(' ');
}

/**
 * Converts a string to a number by removing all non-numeric characters
 * @param {string | number} value - The string to convert
 *
 * @returns {number} The number
 */
export function stringToNumber(value?: string | number): number {
	if (!value) {
		return 0;
	}

	return +(String(value).replaceAll(',', '.'));
}

/**
 * Normalize a string by removing accents and special characters, lower-casing it and removing spaces at the
 * beginning and end, but not in the middle.
 * @param str - string to normalize
 *
 * @returns string - normalized string
 */
export function normalize(str: string) {
	return String(str)
		.normalize('NFD') // Normalize to decomposed form
		.replace(/[\u0300-\u036F]/g, '') // Remove combining diacritical marks
		.replace(/[^a-z0-9 ]/gi, '') // Remove non-alphanumeric characters but spaces
		.toLowerCase() // Lowercase
		.trim() // Remove spaces at the beginning and end
	;
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
	if (!slot) {
		return false;
	}

	return slot(slotProps).some((vnode) => {
		if (Array.isArray(vnode.children)) {
			return !!vnode.children.length;
		}

		return vnode.type !== Comment;
	});
}

/**
 * Calculates the distance between two points on Earth using the Haversine formula
 *
 * @param {number} lat1 - The latitude of the first point
 * @param {number} long1 - The longitude of the first point
 * @param {number} lat2 - The latitude of the second point
 * @param {number} long2 - The longitude of the second point
 *
 * @returns {number} The distance between the two points in kilometers
 */
export function haversineDistance(lat1: number, long1: number, lat2: number, long2: number): number {
	const R = 6371; // Earth's radius in kilometers

	const toRadians = (degree: number): number => degree * (Math.PI / 180);

	const dLat = toRadians(lat2 - lat1);
	const dLong = toRadians(long2 - long1);

	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
		+ Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2))
		* Math.sin(dLong / 2) * Math.sin(dLong / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c; // Distance in kilometers
}

/**
 * Gets the logo for a refill station based on its name
 *
 * @param {string} name - The refill station name
 *
 * @return {string|undefined} The logo path if anyone matches
 */
export function getLogoForStation(name: string): string | undefined {
	const normalizedName = normalize(name);
	const savedLogos = [
		'agla',
		'alcampo',
		'avia',
		'ballenoil',
		'bonarea',
		'bp',
		'campsa',
		'carrefour',
		'cepsa',
		'disa',
		'eroski',
		'galp',
		'meroil',
		'naturgy',
		'petronor',
		'petroprix',
		'plenoil',
		'q8',
		'repsol',
		'shell',
		'tamoil',
		'valcarce',
	] as const;
	for (const logo of savedLogos) {
		if (normalizedName.includes(logo)) {
			return `/eess/${logo}.svg`;
		}
	}

	if (normalizedName.includes('sca')
		|| normalizedName.includes('cooperativa')
		|| normalizedName.includes('coop')
		|| normalizedName.includes('s.c.a.')) {
		return '/eess/cooperativa.svg';
	}

	return undefined;
}
