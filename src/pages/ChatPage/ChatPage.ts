import Block from "../../utils/Block";
import {Link} from "../../components/Link/Link";
import {Label} from "../../components/Label/Label";
import {ChatListItem, IChatListItemProps} from "../../components/ChatListItem/ChatListItem";
import {ChatContent} from "../../components/ChatContent/ChatContent";
import router from "../../utils/Router";

const chats: IChatListItemProps[] = [
	{
		id: 1,
		avatar: '/images/avatar.png',
		name: 'Андрей',
		lastMessage: 'Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой. Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.',
		time: '10:49',
		notifications: 2,
	},
	{
		id: 2,
		avatar: '/images/avatar.png',
		name: 'Андрей',
		lastMessage: 'Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой. Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.',
		time: '10:49',
		notifications: 2,
	}
]

export class ChatPage extends Block {
	constructor() {

		const ChatItems = chats.map((item) => {
			return new ChatListItem({
				id: item.id,
				avatar: item.avatar,
				name: item.name,
				lastMessage: item.lastMessage,
				time:  item.time,
				notifications: item.notifications,
				onClick: (e: MouseEvent, item: Block) => {
					e.preventDefault()
					this.lists.ChatItems.forEach((chat) => {
						(chat as Block).setProps({isActive: chat === item})
						const selectedChat = chats.find(chat => chat.id === item.props.id)
						if (chat === item) {
							this.children.ChatContent.setProps({...selectedChat})
						}
					})
				}
			});
		});
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
			ChatItems,
			ChatContent: new ChatContent({})
		});
	}

	render() {
		return `<section class="chats">
							<div class="chats__sidebar">
								{{{ ProfileLink }}}
								{{{ SearchLabel }}}
								<ul class="chats__list">
										{{{ ChatItems }}}
							</ul>
							</div>
							{{{ ChatContent }}}
						
						</section>`;
	}
}
