export class ChatMessageEntity {
	date: Date;
	text: string;

	constructor(text: string) {
		this.date = new Date();
		this.text = text;
	}
}
