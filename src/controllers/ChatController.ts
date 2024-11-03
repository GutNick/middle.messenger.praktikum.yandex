import store from "../utils/Store";
import chatApi from "../api/ChatApi";
import {IUserData} from "../api/AuthApi";
import {sortByLastMessage} from "../utils/helpers";

class ChatController {
	socket: null | WebSocket
	constructor() {
		this.socket = null
	}

	public async getUserChats(): Promise<Promise<null | undefined> | void> {
		try {
			const res = await chatApi.getChats();
			if (res.status !== 200) {
				return null
			}
			const chats = JSON.parse(res.responseText);
			store.set('chats', sortByLastMessage(chats));
		} catch (error) {
			console.error("Error during get chats:", error);
		}
	}

	public async createChat(title: string): Promise<Promise<null | undefined> | void> {
		try {
			const res = await chatApi.create(title)
			if (res.status !== 200) {
				return null
			}
			await this.getUserChats()
		} catch (error) {
			console.error("Error during create chat:", error);
		}
	}

	public async getToken(chatId:number) {
		try {
			const res = await chatApi.getToken(chatId)
			if (res.status !== 200) {
				return null
			}
			return JSON.parse(res.responseText).token;
		} catch (error) {
			console.error("Error during create chat:", error);
		}
	}

	public async changeChatAvatar(formData: FormData) {
		try {
			const res = await chatApi.setChatAvatar(formData)
			if (res.status !== 200) {
				return null
			}
			return JSON.parse(res.responseText)
		} catch (error) {
			console.error("Error during create chat:", error);
		}
	}

	public async addRemoveUsers(chatId:number, users: number[], add: boolean): Promise<Promise<null | undefined> | void | string> {
		try {
			const res = await chatApi.addRemoveUsers(chatId, users, add)
			if (res.status !== 200 || res.responseText !== "OK") {
				return null
			}
			return res.responseText
		} catch (error) {
			console.error("Error during create chat:", error);
		}
	}

	public async searchUser(login: string) {
		try {
			const res = await chatApi.searchUser(login)
			if (res.status !== 200) {
				return null
			}
			return JSON.parse(res.responseText)
		} catch (error) {
			console.error("Error during create chat:", error);
		}
	}

	public async chatWebSocket(chatId: number) {
		const token = await this.getToken(chatId)
		const user: IUserData = store.getState()?.user as IUserData
		const userId: number = user.id as number;
		this.socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`);
		let ping: ReturnType<typeof setInterval>
		this.socket.addEventListener('open', () => {
			console.log('Соединение установлено');
			this.getMessages()
			ping = setInterval(() => this.sendMessage('', 'ping'), 60000);
		});

		this.socket.addEventListener('close', event => {
			if (event.wasClean) {
				console.log('Соединение закрыто чисто');
			} else {
				console.log('Обрыв соединения');
			}
			clearInterval(ping)

			console.log(`Код: ${event.code} | Причина: ${event.reason}`);
		});

		this.socket.addEventListener('message', event => {
			try {
				let data = JSON.parse(event.data);
				if (data.type === "message" || Array.isArray(data)) {
					if (Array.isArray(data)) {
						data = data.sort(function(a: {time: string}, b: {time: string}) {
							return (a.time < b.time) ? -1 : ((a.time > b.time) ? 1 : 0);
						});
						store.set('messages', JSON.stringify(data));
					} else {
						const storeMessages = JSON.parse(store.getState().messages as string) || []
						storeMessages.push(data)
						store.set('messages', JSON.stringify(storeMessages));
					}
				}
			} catch (error) {
				console.error("Error during get message:", error);
			}
			console.log('Получены данные', event.data);
		});
	}

	public async sendMessage(message: string, type?: string) {
		this.socket?.send(JSON.stringify({
			content: message,
			type: type || 'message',
		}));
	}

	public async getMessages() {
		this.socket?.send(JSON.stringify({
			content: "0",
			type: "get old"
		}));
	}

	public async closeSocket() {
		this.socket?.close();
	}

	public async deleteChat(chatId: number): Promise<Promise<null | undefined | {result: {id: number}}> | void> {
		try {
			const res = await chatApi.delete(chatId)
			if (res.status !== 200) {
				return null
			}
			return JSON.parse(res.responseText)
		} catch (error) {
			console.error("Error during create chat:", error);
		}
	}
}

export default new ChatController();
