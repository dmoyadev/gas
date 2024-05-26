import type { DTO } from '@/modules/app/models/DTO.ts';
import type { RefillStation } from '@/modules/refills/models/RefillStation.ts';

export interface Refill extends DTO {
	idVehicle: string;
	totalCost: string | number;
	unitCost: string | number;
	chargeInitial?: number;
	chargeFinal?: number;
	units: string | number;
	fuelType: Fuel;
	odometer?: number;
	station: RefillStation;
	notes: string;
}

export interface Fuel {
	name: string;
	type: 'fuel' | 'electric';
}
