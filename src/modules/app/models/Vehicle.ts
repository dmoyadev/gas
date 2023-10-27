export enum VehicleType {
	CAR = 'car',
	MOTORCYCLE = 'motorcycle',
}

export enum VehicleFuelType {
	GASOLINE = 'gasoline',
	DIESEL = 'diesel',
	ELECTRIC = 'electric',
	HYBRID = 'hybrid',
}

export interface VehicleBrand {
	name: string;
	logo: string;
	highlighted?: boolean;
}

export interface Vehicle {
	id: string;
	brand: VehicleBrand;
	model: string;
	odometer: number;
	batteryCapacity: number;
	alias: string;
	plate: string;
	year: number;
	vehicleType: VehicleType;
	fuelType: VehicleFuelType;
	selected: boolean;
}

export interface ElectricVehicle extends Vehicle {
	battery: number;
	fuelType: VehicleFuelType.ELECTRIC | VehicleFuelType.HYBRID;
}

export const isElectricVehicle = (vehicle: Vehicle): vehicle is ElectricVehicle => {
	return vehicle.fuelType === VehicleFuelType.ELECTRIC || vehicle.fuelType === VehicleFuelType.HYBRID;
};