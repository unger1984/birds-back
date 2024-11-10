import { OnlineLogEntity } from '../entities/online.log.entity';

export abstract class OnlineRepository {
	public abstract log(entity: OnlineLogEntity): Promise<OnlineLogEntity>;
}
