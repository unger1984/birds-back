import jwt from 'jsonwebtoken';

import { UserRepository } from '../repositories/user.repository';
import { GoogleRepository } from '../repositories/google.repository';
import { UserEntity } from '../entities/user.entity';
import { ConfigEntity } from '../entities/config.entity';
import { LogFactory } from '../../factories/log.factory';

export class UserUseCases {
	private readonly _log = LogFactory.getInstance().createLogger('UserUseCases');
	private readonly _config: ConfigEntity;
	private readonly _userRepository: UserRepository;
	private readonly _googleRepository: GoogleRepository;

	constructor(options: { config: ConfigEntity; userRepository: UserRepository; googleRepository: GoogleRepository }) {
		this._config = options.config;
		this._userRepository = options.userRepository;
		this._googleRepository = options.googleRepository;
	}

	public async auth(access: string): Promise<{ user: UserEntity; token: string } | null> {
		try {
			const { email } = jwt.verify(access, this._config.TOKEN) as { id: number; email: string };
			const user = await this._userRepository.getByEmail(email);
			if (user) {
				const token = jwt.sign({ id: user.id, email: user.email }, this._config.TOKEN);
				return { user, token };
			}
		} catch (exception) {
			this._log.error({ method: 'createOrUpdate', exception, stack: exception.stack });
		}
		return null;
	}

	public async singnIn(access_token: string): Promise<{ user: UserEntity; token: string } | null> {
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
		return null;
	}
}
