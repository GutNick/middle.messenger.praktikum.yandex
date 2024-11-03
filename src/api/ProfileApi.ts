import { HTTPTransport } from '../utils/Http';
import { BaseAPI } from './BaseApi';

const profileAPIInstance = new HTTPTransport();
export interface IProfile {
	first_name: string;
	second_name: string;
	display_name: string;
	login: string;
	email: string;
	phone: string;
	[index: string]: string;
}
class ProfileAPI extends BaseAPI {
	update({first_name, second_name, display_name, login, email, phone}: IProfile) {
		return profileAPIInstance.put('/user/profile', {data: {first_name, second_name, display_name, login, email, phone}})
	}

	updatePassword(oldPassword: string, newPassword: string) {
		return profileAPIInstance.put('/user/password', {data: {oldPassword, newPassword}})
	}

	updateAvatar(formData: FormData) {
		return profileAPIInstance.put('/user/profile/avatar', {data: formData});
	}

	logout() {
		return profileAPIInstance.post('/auth/logout');
	}
}

export default new ProfileAPI()
