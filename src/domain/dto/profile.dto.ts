export class ProfileDto {
	email: string;
	given_name: string;
	id: string;
	name: string;
	picture: string;
	verified_email: boolean;

	constructor(ya: YandexProfileDto) {
		this.email = ya.default_email;
		this.given_name = ya.display_name;
		this.name = ya.real_name;
		this.picture = `https://avatars.yandex.net/get-yapic/${ya.default_avatar_id}/islands-50`;
		this.verified_email = true;
	}
}

export interface YandexProfileDto {
	id: string;
	login: string;
	client_id: string;
	display_name: string;
	real_name: string;
	first_name: string;
	last_name: string;
	sex: string;
	default_email: string;
	emails: string[];
	default_avatar_id: string;
	is_avatar_empty: false;
	psuid: string;
}
