import { Timestamp } from 'firebase/firestore';

export interface DTO {
	user_uuid: string
	id: string
	created_at: Timestamp
	updated_at: Timestamp
}