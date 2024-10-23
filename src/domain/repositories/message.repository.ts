import { MessageEntity } from '../entities/message.entity';

export abstract class MessageRepository {
	public abstract create(entity: MessageEntity): Promise<MessageEntity>;
	public abstract getById(id: number): Promise<MessageEntity>;
	public abstract getLast(): Promise<MessageEntity[]>;
}
