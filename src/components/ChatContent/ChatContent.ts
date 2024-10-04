import Block from "../../utils/Block";
import {Avatar} from "../Avatar/Avatar";
import {Button} from "../Button/Button";
import {Label} from "../Label/Label";
import validator from "../../utils/Validator";

interface IChatContentProps {
	avatar?: string
	name?: string
}

export class ChatContent extends Block {
	constructor(props: IChatContentProps) {
		super({
			...props,
			Avatar: new Avatar({
				src: props.avatar || '',
				className: "chat__avatar-wrapper",
			}),
			ConfigButton: new Button({
				type: 'button',
				child: '',
				className: 'chat__config-button'
			}),
			LabelFileInput: new Label({
				className: 'chat__message-file',
				label: '',
				inputProps: {
					type: 'file',
					className: 'chat__message-file',
					name: 'file',
				}
			}),
			LabelMessageInput: new Label({
				label: '',
				className: 'chat__message',
				inputProps: {
					placeholder: 'Сообщение',
					type: 'text',
					name: 'message',
				}
			}),
			SubmitButton: new Button({
				type: 'submit',
				child: '',
				className: 'chat__message-submit-button',
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					const data: Record<string, string> = {}
					if (validator.isValid(this.children.LabelMessageInput.children.InputElement.getContent(), '^.+$', 'Не должно быть пустым').isValid) {
						const {name, value} = this.children.LabelMessageInput.children.InputElement.getContent() as HTMLInputElement;
						data[name] = value
						console.log(data)
					}
				}
			}),
		});
	}

	componentDidUpdate(oldProps: Record<string, unknown>, newProps: Record<string, unknown>): boolean {
		if (oldProps.avatar !== newProps.avatar) {
			this.children.Avatar.setProps({src: newProps.avatar});
		}
		return true
	}

	render() {
		return `<div class="chats__content chat">
								{{#if this.name}}
								<div class="chat__header">
									{{{ Avatar }}}
									<div class="chat__name">{{name}}</div>
									{{{ ConfigButton }}}
								</div>
								<div class="chat__content">
									<p class="chat__date">19 июня</p>
									<div class="chat__message">
										<p class="chat__message-text">Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. 
										Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, 
										так как астронавты с собой забрали только кассеты с пленкой. Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. 
										Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.</p>
										<p class="chat__message-time">11:56</p>
									</div>
									<div  class="chat__message chat__message_user">
										<p class="chat__message-text">Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. 
																Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, 
																так как астронавты с собой забрали только кассеты с пленкой. Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. 
																Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.</p>
																<p class="chat__message-time">12:00</p>
									</div>
								</div>
								<div class="chat__footer">
									<form class="chat__message-form">
									{{{ LabelFileInput }}}
										{{{ LabelMessageInput }}}
										{{{ SubmitButton }}}
									</form>
								
								</div>
								{{^}}
								<p class="chats__info-message">Выберите чат чтобы отправить сообщение</p>
								{{/if}}
							</div>`
	}
}
