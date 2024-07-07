export interface IUser {
	user_id: string;
	name: string;
	last_name: string;
	email: string;
	full_address: string;
	phone_number: string;
	status: string;
	description: string;
	payment_amount: number;
	payment_year: number;
	membership_expiration_date: Date;
	created_at: Date;
}

export interface IPersonal {
	personal_id: string;
	name: string;
	last_name: string;
	role: string;
	email: string;
	details: string;
	permission: number;
	password: string;
	created_at: Date;
}

export interface IPayment {
	payment_id: string;
	user_id: string;
	amount: number;
	payment_year: number;
	payment_date: Date;
}
