import { UserEntity } from '../entities/user.entity';
import { WsDataMessage } from '../dto/ws.dto';
import { MessageEntity } from '../entities/message.entity';
import { MessageRepository } from '../repositories/message.repository';
import { UserDto } from '../dto/user.dto';

export class MessageUseCases {
	private readonly _messageRepository: MessageRepository;

	constructor(options: { messageRepository: MessageRepository }) {
		this._messageRepository = options.messageRepository;
	}

	public async addMessage(dto: WsDataMessage, user: UserEntity): Promise<WsDataMessage> {
		const entity = new MessageEntity(dto, user.id);
		const message = await this._messageRepository.create(entity);
		return new WsDataMessage(message.text, message.date, new UserDto(message.user));
	}

	public get last(): Promise<MessageEntity[]> {
		return this._messageRepository.getLast();
	}
}
