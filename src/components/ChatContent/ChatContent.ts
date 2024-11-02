import Block from "../../utils/Block";
import {Avatar} from "../Avatar/Avatar";
import {Button} from "../Button/Button";
import {Label} from "../Label/Label";
import validator from "../../utils/Validator";
import {Modal} from "../Modal/Modal";
import chatController from "../../controllers/ChatController";
import {ChatConfigPopup} from "../ChatConfigPopup/ChatConfigPopup";
import {IUserData} from "../../api/AuthApi";

interface IChatContentProps {
	avatar?: string
	title?: string
}

export class ChatContent extends Block {
	file: File | null
	isConfigPopupOpened: boolean
	userName: string
	constructor(props: IChatContentProps) {
		super({
			...props,
			AvatarButton: new Button({
				type: 'button',
				className: 'chat__avatar-button',
				child: new Avatar({
					src: props.avatar ? `https://ya-praktikum.tech/api/v2/resources${props.avatar}` : '/images/avatar.png',
					className: "chat__avatar-wrapper",
				}),
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					this.children.ModalAvatar.setProps({isActive: true})
				}
			}),
			ModalAddUser: new Modal({
				title: "Добавить пользователя",
				input: new Label({
					label: '',
					className: 'popup',
					inputProps: {
						className: "popup",
						onBlur: (e: Event) => {
							if ((e.target as HTMLInputElement).value) {
								this.userName = (e.target as HTMLInputElement).value
								this.children.ModalAddUser.children.Button.setAttributes({disabled: false})
							}
						}
					}
				}),
				button: new Button({
					child: 'Добавить',
					className: "popup__button",
					type: "submit",
					onClick: (e: MouseEvent) => {
						e.preventDefault()
						chatController.searchUser(this.userName)
							.then((users: IUserData[]) => {
								if (!users.length) {
									this.children.ModalAddUser.children.Input.children.ErrorMessage.setProps({text: "Пользователь не найден"})
									this.children.ModalAddUser.children.Input.children.ErrorMessage.show()
									this.children.ModalAddUser.children.Button.setAttributes({disabled: true});
									throw new Error("Пользователь не найден")
								}
								return users.map(user => user.id)
							})
							.then(usersId => {
								chatController.addRemoveUsers(this.props.id as number, usersId, true)
									.then((status) => {
										if (!status || status !== "OK") {
											throw new Error()
										}
										this.children.ModalAddUser.children.Button.setAttributes({disabled: true});
										this.children.ModalAddUser.setProps({isActive: false})
									})
							})
					}
				}),
				isActive: false
			}),
			ModalRemoveUser: new Modal({
				title: "Удалить пользователя",
				input: new Label({
					label: '',
					className: 'popup',
					inputProps: {
						className: "popup",
						onBlur: (e: Event) => {
							if ((e.target as HTMLInputElement).value) {
								this.userName = (e.target as HTMLInputElement).value
								this.children.ModalRemoveUser.children.Button.setAttributes({disabled: false})
							}
						}
					}
				}),
				button: new Button({
					child: 'Удалить',
					className: "popup__button",
					type: "submit",
					onClick: (e: MouseEvent) => {
						e.preventDefault()
						chatController.searchUser(this.userName)
							.then((users: IUserData[]) => {
								if (!users.length) {
									this.children.ModalRemoveUser.children.Input.children.ErrorMessage.setProps({text: "Пользователь не найден"})
									this.children.ModalRemoveUser.children.Input.children.ErrorMessage.show()
									this.children.ModalRemoveUser.children.Button.setAttributes({disabled: true});
									throw new Error("Пользователь не найден")
								}
								return users.map(user => user.id)
							})
							.then(usersId => {
								chatController.addRemoveUsers(this.props.id as number, usersId, false)
									.then((status) => {
										if (!status || status !== "OK") {
											throw new Error()
										}
										this.children.ModalRemoveUser.children.Button.setAttributes({disabled: true});
										this.children.ModalRemoveUser.setProps({isActive: false})
									})
							})
					}
				}),
				isActive: false
			}),
			ModalAvatar: new Modal({
				title: "Загрузите файл",
				input: new Label({
					className: "chat__avatar-label",
					label: 'Выбрать файл на компьютере',
					inputProps: {
						type: 'file',
						name: "avatar",
						onChange: (e: InputEvent) => {
							const inputTarget = e.target as HTMLInputElement;
							if (inputTarget && inputTarget.files) {
								this.setFileName(inputTarget.files[0].name)
								this.file = inputTarget.files[0];
								this.setAvatarButtonDisabled(false)
								this.children.ModalAvatar.children.Input.hide()
							} else {
								this.setAvatarButtonDisabled(true)
							}
						}
					}
				}),
				button: new Button({
					child: 'Поменять',
					className: "popup__button",
					type: "submit",
					onClick: (e: MouseEvent) => {
						e.preventDefault()
						if (this.props.id && this.file) {
							const formData = new FormData
							formData.append('chatId', (this.props.id as number).toString())
							formData.append('avatar', this.file)
							chatController.changeChatAvatar(formData)
								.then((data) => {
									if (data) {
										this.children.AvatarButton.children.child.setProps({src: `https://ya-praktikum.tech/api/v2/resources${data.avatar}`});
									}
									this.children.ModalAvatar.setProps({isActive: false})
									this.setFileName('')
									this.children.ModalAvatar.children.Input.show()
									this.file = null
								})
						}
					}
				}),
				isActive: false
			}),
			ConfigButton: new Button({
				type: 'button',
				child: '',
				className: 'chat__config-button',
				onClick: (e: MouseEvent) => {
					e.preventDefault()
					if (this.isConfigPopupOpened) {
						this.children.ChatConfigPopup.hide()
					} else {
						this.children.ChatConfigPopup.show()
					}
					this.isConfigPopupOpened = !this.isConfigPopupOpened
				}
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
					if (validator.isValid(this.children.LabelMessageInput.children.InputElement.getContent(), '^.+$', 'Не должно быть пустым').isValid) {
						const inputElement = this.children.LabelMessageInput.children.InputElement.getContent() as HTMLInputElement
						const {value} = inputElement;
						chatController.sendMessage(value.replace(/<\/[^>]+(>|$)/g, ""))
							.then(() => {
								this.scrollToBottom()
								inputElement.value = ''
							})
					}
				}
			}),
			ChatConfigPopup: new ChatConfigPopup({
				addUser: () => {
					this.showAddUserPopup()
				},
				removeUser: () => {
					this.showRemoveUserPopup()
				}
			})
		});
		this.file = null
		this.isConfigPopupOpened = false
		this.userName = ''
	}

	componentDidUpdate(oldProps: Record<string, unknown>, newProps: Record<string, unknown>): boolean {
		if (oldProps.avatar !== newProps.avatar && this.children.AvatarButton) {
			this.children.AvatarButton.children.child.setProps({src: newProps.avatar ? `https://ya-praktikum.tech/api/v2/resources${newProps.avatar}` : '/images/avatar.png',});
		}
		return true
	}
	componentDidMount() {
		super.componentDidMount();
		this.scrollToBottom()
	}

	scrollToBottom() {
		const contentSection = document.querySelector(".chat__content");
		if (contentSection) {
			contentSection.scrollTop = contentSection.scrollHeight;
		}
	}

	setFileName(fileName: string): void {
		this.children.ModalAvatar.setProps({description: fileName})
	}

	setAvatarButtonDisabled(disabled: boolean): void {
		this.children.ModalAvatar.children.Button.setAttributes({disabled});
	}

	showAddUserPopup(): void {
		this.children.ModalAddUser.setProps({isActive: true})
		this.isConfigPopupOpened = false
	}

	showRemoveUserPopup(): void {
		this.children.ModalRemoveUser.setProps({isActive: true})
		this.isConfigPopupOpened = false
	}

	render() {
		return `<div class="chats__content chat">
								{{#if this.title}}
								<div class="chat__header">
									{{{ AvatarButton }}}
									<div class="chat__name">{{title}}</div>
									{{{ ConfigButton }}}
								</div>
								<div class="chat__content">
								{{#each messages}}
								{{#if this.isUserMessage}}
								<div  class="chat__message chat__message_user">
								{{else}}
								<div class="chat__message">
								{{/if}}
										<p class="chat__message-text">{{this.content}}</p>
										<p class="chat__message-time">{{time}}</p>
									</div>
									{{/each}}
								{{{ChatConfigPopup}}}
								</div>
								<div class="chat__footer">
									<form class="chat__message-form">
<!--									{{{ LabelFileInput }}}-->
										{{{ LabelMessageInput }}}
										{{{ SubmitButton }}}
									</form>
								
								</div>
								{{^}}
								<p class="chats__info-message">Выберите чат чтобы отправить сообщение</p>
								{{/if}}
								{{{ ModalAvatar }}}
								{{{ ModalAddUser }}}
								{{{ ModalRemoveUser }}}
							</div>`
	}
}
