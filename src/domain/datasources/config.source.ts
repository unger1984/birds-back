import { ConfigEntity } from '../entities/config.entity';

export abstract class ConfigSource {
	public abstract get config(): ConfigEntity;
}
