import Block, {Props} from "../../utils/Block";
import {Link} from "../../components/Link/Link";
import {Label} from "../../components/Label/Label";
import {ChatListItem, IChatListItemProps} from "../../components/ChatListItem/ChatListItem";
import {ChatContent} from "../../components/ChatContent/ChatContent";
import router from "../../utils/Router";
import {connect} from "../../utils/HOC";
import store from "../../utils/Store";
import authApi, {IUserData} from "../../api/AuthApi";
import chatController from "../../controllers/ChatController";
import {Button} from "../../components/Button/Button";
import {Modal} from "../../components/Modal/Modal";
import {Input} from "../../components/Input/Input";

interface IMessage {
	user_id: number;
	content: string;
	time: string;
}

class ChatPage extends Block {
	newChatTitle: string
	constructor() {
		if (!store.getState().user) {
			authApi.getUser()
				.then(data => {
					if (data.status === 200) {
						const userData = JSON.parse(data.responseText);
						store.set('user', userData);
					} else {
						router.go('/')
					}
				})
		}
		super({
			ProfileLink: new Link({
				href: '#',
				dataPage: '/settings',
				text: 'Профиль',
				className: 'chats__link',
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					const target = e.target as HTMLAnchorElement;
					if (target.dataset?.page) {
						router.go(target.dataset.page)
					}
				}
			}),
			SearchLabel: new Label({
				label: "",
				className: 'chats',
				inputProps: {
					type: "search",
					placeholder: "Поиск"
				}
			}),
			CreateChatButton: new Button({
				child: "Создать чат",
				className: 'chats__createButton',
				onClick: (e: MouseEvent) => {
					e.preventDefault()
					this.children.Modal.setProps({isActive: true})
				}
			}),
			Modal: new Modal({
				title: "Создать чат",
				input: new Input({
					className: "popup",
					onBlur: (e: Event) => {
						if ((e.target as HTMLInputElement).value) {
							this.newChatTitle = (e.target as HTMLInputElement).value
							this.children.Modal.children.Button.setAttributes({disabled: false})
						}
					}
				}),
				button: new Button({
					child: 'Создать чат',
					className: "popup__button",
					type: "submit",
					onClick: (e: MouseEvent) => {
						e.preventDefault()
						if (this.newChatTitle) {
							this.createChat(this.newChatTitle)
								.then(() => {
									this.children.Modal.setProps({isActive: false})
									this.getChats()
								})
						}
					}
				}),
				isActive: false
			}),
			ChatItems: [],
			ChatContent: new ChatContent({})
		});

		this.newChatTitle = ''

		this.getChats()
	}

	async getChats() {
		await chatController.getUserChats()
			.then(() => {
			const chats: IChatListItemProps[] = store.getState().chats as IChatListItemProps[];
			this.lists.ChatItems = chats.map((item: IChatListItemProps) => {
				return new ChatListItem({
					id: item.id,
					avatar: item.avatar,
					title: item.title,
					last_message: item.last_message,
					time:  item.time,
					unread_count: item.unread_count,
					onClick: async (e: MouseEvent, item: Block) => {
						await chatController.closeSocket()
						await chatController.chatWebSocket(item.props.id as number)
						e.preventDefault()
						this.lists.ChatItems.forEach((chat) => {
							(chat as Block).setProps({isActive: chat === item})
							const selectedChat = chats.find(chat => chat.id === item.props.id)
							if (chat === item) {
								this.children.ChatContent.setProps({...selectedChat })
							}
						})
					}
				});
			})
			this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
		})
	}

	async createChat(title: string) {
		await chatController.createChat(title)
	}

	componentDidUpdate(oldProps: Props, newProps: Props): boolean {
		if (store.getState().messages) {
			this.children.ChatContent.setProps({messages: JSON.parse(store.getState().messages as string).map((message: IMessage) => {
					const time = new Date(message.time);
					return {...message, isUserMessage: message.user_id === (store.getState().user as IUserData).id, time: time.getHours() + ":" + time.getMinutes()}
				})})
		}
		return super.componentDidUpdate(oldProps, newProps);
	}

	render() {
		return `<section class="chats">
							<div class="chats__sidebar">
								{{{ ProfileLink }}}
								{{{ CreateChatButton }}}
								{{{ SearchLabel }}}
								<ul class="chats__list">
										{{{ ChatItems }}}
							</ul>
							</div>
							{{{ ChatContent }}}
						{{{ Modal }}}
						</section>`;
	}
}

export default connect((state) => ({
	chats: state.chats,
	messages: state.messages,
	user: state.user
}))(ChatPage);
