export class ApiErrorEntity extends Error {
	statusCode: number;
	data: any;

	constructor(status: number, data: any) {
		super();
		this.statusCode = status;
		this.data = data;
	}
}
