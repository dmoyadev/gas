import type { DTO } from '@/modules/app/models/DTO.ts';

export interface Refill extends DTO {
	idVehicle: string;
	totalCost: number;
	unitCost: number;
	chargeInitial: number;
	chargeFinal: number;
	units: number;
	fuelType: Fuel;
	odometer: number;
	station: Station;
	notes: string;
}

export interface Fuel {
	name: string;
	type: 'fuel' | 'electric';
}

export interface Station {
	name: string;
	logo?: string;
	address: string;
}
