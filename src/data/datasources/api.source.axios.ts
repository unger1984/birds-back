import axios, { AxiosResponse } from 'axios';
import { stringify } from 'qs';
import https from 'https';

import { ApiSource } from '../../domain/datasources/api.source';
import { ApiErrorEntity } from '../../domain/entities/api.error.entity';

export class ApiSourceAxios implements ApiSource {
	private readonly _agent = new https.Agent({
		rejectUnauthorized: false,
	});

	constructor() {
		axios.defaults.paramsSerializer = (params: any): string => stringify(params, { encode: false });
		axios.defaults.httpsAgent = this._agent;
	}

	private sendData = <T>(res: AxiosResponse<T>): T => res.data;

	public get<T>(url: string, params?: any): Promise<T> {
		return axios
			.get<T>(url, params)
			.catch(err => {
				if (err.response) {
					throw new ApiErrorEntity(err.response.status, err.response.data);
				}
				throw err;
			})
			.then(res => this.sendData<T>(res));
	}

	public delete<T>(url: string, params?: any): Promise<T> {
		return axios
			.delete<T>(url, params)
			.catch(err => {
				if (err.response) {
					throw new ApiErrorEntity(err.response.status, err.response.data);
				}
				throw err;
			})
			.then(res => this.sendData<T>(res));
	}

	public post<T, D = any>(url: string, data?: D, params?: any): Promise<T> {
		return axios
			.post<T>(url, data, params)
			.catch(err => {
				if (err.response) {
					throw new ApiErrorEntity(err.response.status, err.response.data);
				}
				throw err;
			})
			.then(res => this.sendData<T>(res));
	}

	public put<T, D = any>(url: string, data?: D, params?: any): Promise<T> {
		return axios
			.put<T>(url, data, params)
			.catch(err => {
				if (err.response) {
					throw new ApiErrorEntity(err.response.status, err.response.data);
				}
				throw err;
			})
			.then(res => this.sendData<T>(res));
	}
}
