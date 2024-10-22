export abstract class WsService {
	public abstract listen(): Promise<void>;
}
