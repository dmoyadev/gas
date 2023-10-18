export enum VehicleType {
	CAR = 'car',
	BIKE = 'bike',
}

export enum VehicleFuelType {
	GASOLINE = 'gasoline',
	DIESEL = 'diesel',
	ELECTRIC = 'electric',
	HYBRID = 'hybrid',
}

export interface Vehicle {
	brand: string;
	model: string;
	name: string;
	odometer: number;
	plate: string;
	year: number;
	vehicleType: VehicleType;
	fuelType: VehicleFuelType;
}

export interface ElectricVehicle extends Vehicle {
	battery: number;
	fuelType: VehicleFuelType.ELECTRIC | VehicleFuelType.HYBRID;
}

export const isElectricVehicle = (vehicle: Vehicle): vehicle is ElectricVehicle => {
	return vehicle.fuelType === VehicleFuelType.ELECTRIC || vehicle.fuelType === VehicleFuelType.HYBRID;
};