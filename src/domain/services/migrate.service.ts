export abstract class MigrateService {
	public abstract migrate(): Promise<void>;
}
