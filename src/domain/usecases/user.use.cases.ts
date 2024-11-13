import jwt from 'jsonwebtoken';

import { UserRepository } from '../repositories/user.repository';
import { GoogleRepository } from '../repositories/google.repository';
import { UserEntity } from '../entities/user.entity';
import { ConfigEntity } from '../entities/config.entity';
import { LogFactory } from '../../factories/log.factory';
import { WsSignType } from '../dto/ws.dto';
import { YandexRepository } from '../repositories/yandex.repository';

export class UserUseCases {
	private readonly _log = LogFactory.getInstance().createLogger('UserUseCases');
	private readonly _config: ConfigEntity;
	private readonly _userRepository: UserRepository;
	private readonly _googleRepository: GoogleRepository;
	private readonly _yandexRepository: YandexRepository;

	constructor(options: {
		config: ConfigEntity;
		userRepository: UserRepository;
		googleRepository: GoogleRepository;
		yandexRepository: YandexRepository;
	}) {
		this._config = options.config;
		this._userRepository = options.userRepository;
		this._googleRepository = options.googleRepository;
		this._yandexRepository = options.yandexRepository;
	}

	public async auth(access: string): Promise<{ user: UserEntity; token: string } | null> {
		try {
			const { email } = jwt.verify(access, this._config.TOKEN) as { id: number; email: string };
			const user = await this._userRepository.getByEmail(email);
			if (user) {
				await this._userRepository.createOrUpdate({ ...user, last_seen: new Date() });
				const token = jwt.sign({ id: user.id, email: user.email }, this._config.TOKEN);
				return { user, token };
			}
		} catch (exception) {
			this._log.error({ method: 'createOrUpdate', exception, stack: exception.stack });
		}
		return null;
	}

	public async singnIn(access_token: string, type?: WsSignType): Promise<{ user: UserEntity; token: string } | null> {
		if (type === WsSignType.yandex) {
			try {
				const profile = await this._yandexRepository.getProfile(access_token);
				if (profile) {
					const user = await this._userRepository.createOrUpdate(new UserEntity(profile));
					const token = jwt.sign({ id: user.id, email: user.email }, this._config.TOKEN);
					return { user, token };
				}
			} catch (exception) {
				this._log.error({ method: 'createOrUpdate', exception, stack: exception.stack });
			}
		} else {
			try {
				const profile = await this._googleRepository.getProfile(access_token);
				if (profile) {
					const user = await this._userRepository.createOrUpdate(new UserEntity(profile));
					const token = jwt.sign({ id: user.id, email: user.email }, this._config.TOKEN);
					return { user, token };
				}
			} catch (exception) {
				this._log.error({ method: 'createOrUpdate', exception, stack: exception.stack });
			}
		}
		return null;
	}
}
