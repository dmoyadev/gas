export interface RefillStation {
	id: number;
	zip: string;
	address: string;
	lat: number;
	long: number;
	city: string;
	state: string;
	name: string;
	distance?: number;
}
