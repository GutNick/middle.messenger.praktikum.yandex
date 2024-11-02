import { HTTPTransport } from '../utils/Http';
import { BaseAPI } from './BaseApi';

const chatAPIInstance = new HTTPTransport();

class ChatAPI extends BaseAPI {
	getChats() {
		return chatAPIInstance.get('/chats');
	}

	create(title: string) {
		return chatAPIInstance.post('/chats', {data: {title}});
	}

	getToken(chatId: number) {
		return chatAPIInstance.post(`/chats/token/${chatId}`);
	}

	setChatAvatar(formData: FormData) {
		return chatAPIInstance.put('/chats/avatar', {data: formData});
	}

	searchUser(login: string) {
		return chatAPIInstance.post('/user/search', {data: {"login": login}});
	}

	addRemoveUsers(chatId: number, users: number[], add: boolean) {
		if (add) {
			return chatAPIInstance.put('/chats/users', {data: {chatId, users}});
		}
		return chatAPIInstance.delete('/chats/users', {data: {chatId, users}});
	}
}

export default new ChatAPI()
