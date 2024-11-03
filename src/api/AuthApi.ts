import { HTTPTransport } from '../utils/Http';
import { BaseAPI } from './BaseApi';

const authAPIInstance = new HTTPTransport();

export interface ISignInData {
	login: string;
	password: string;
}

export interface ISignUpData {
	first_name: string;
	second_name: string;
	login: string;
	email: string;
	password: string;
	phone: string;
}

export interface IUserData {
	id: number;
	first_name: string;
	second_name: string;
	display_name: string;
	login: string;
	email: string;
	password: string;
	phone: string;
	avatar: string;
}
class AuthAPI extends BaseAPI {
	signIn(userData: ISignInData) {
		return authAPIInstance.post('/auth/signin', {data: userData})
	}

	signUp(userData: ISignUpData) {
		return authAPIInstance.post('/auth/signup', {data: userData})
	}

	getUser() {
		return authAPIInstance.get("/auth/user");
	}

}
export default new AuthAPI();
