export abstract class ApiSource {
	public abstract get<T>(url: string, params?: any): Promise<T>;
	public abstract delete<T>(url: string, params?: any): Promise<T>;
	public abstract post<T, D = any>(url: string, data: D, params?: any): Promise<T>;
	public abstract put<T = any, D = any>(url: string, data: D, params?: any): Promise<T>;
}
