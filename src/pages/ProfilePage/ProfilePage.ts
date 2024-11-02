import Block from "../../utils/Block";
import {Sidebar} from "../../components/Sidebar/Sidebar";
import {Avatar} from "../../components/Avatar/Avatar";
import {Button} from "../../components/Button/Button";
import {Label} from "../../components/Label/Label";
import {getFormData, validateForm} from "../../utils/helpers";
import {Link} from "../../components/Link/Link";
import store from "../../utils/Store";
import authApi, {IUserData} from "../../api/AuthApi";
import router from "../../utils/Router";
import {connect} from "../../utils/HOC";
import profileController from "../../controllers/ProfileController";
import {IProfile} from "../../api/ProfileApi";
import {Modal} from "../../components/Modal/Modal";

enum stateKeys {
	IS_EDITING_PROFILE = "isEditingProfile",
	IS_CHANGING_PASSWORD = "isChangingPassword",
}

class ProfilePage extends Block {
	static noValidateRule = {
		customValidateRule: {
			rule: '.*',
			message: ' ',
		}
	}
	private isChangingPassword: boolean;
	private isEditingProfile: boolean;
	file: File | null

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
			Sidebar: new Sidebar(),
			Avatar: new Avatar({
				className: 'profile__avatar',
				src: ""
			}),
			AvatarButton: new Button({
				child: 'Поменять аватар',
				className: 'profile__avatar-button',
				type: 'button',
				onClick: (e: MouseEvent) => {
					e.preventDefault()
					this.children.ModalAvatar.setProps({isActive: true})
				}
			}),
			OldPasswordLabel: new Label({
				className: 'profile',
				label: 'Старый пароль',
				inputProps: {
					id: 'oldPassword',
					type: 'password',
					name: 'oldPassword',
					onBlur: () => {
						this.checkFormValidity()
					},
					validateRule: "password"
				}
			}),
			NewPasswordLabel: new Label({
				label: 'Новый пароль',
				className: 'profile',
				inputProps: {
					id: 'newPassword',
					type: 'password',
					name: 'newPassword',
					onBlur: (e) => {
						const target = e.target as HTMLInputElement;
						this.setCheckPasswordProps(target.value)
						this.checkFormValidity()
					},
					validateRule: "password",
				}
			}),
			PasswordCheckLabel: new Label({
				label: 'Повторите новый пароль',
				className: 'profile',
				customValidateRule: {
					rule: '^.+$',
					message: 'Не должно быть пустым',
				},
				inputProps: {
					id: 'repeatPassword',
					type: 'password',
					onBlur: () => {
						this.checkFormValidity()
					},
				},
			}),
			EmailLabel: new Label({
				label: "Почта",
				className: 'profile',
				inputProps: {
					id: 'email',
					type: "email",
					name: 'email',
					value: '',
					onBlur: () => {
						this.checkFormValidity()
					},
					validateRule: "email",
				}
			}),
			LoginLabel: new Label({
				label: "Логин",
				className: 'profile',
				inputProps: {
					id: 'login',
					type: "text",
					name: 'login',
					value: '',
					onBlur: () => {
						this.checkFormValidity()
					},
					validateRule: "login",
				}
			}),
			NameLabel: new Label({
				label: "Имя",
				className: 'profile',
				inputProps: {
					id: 'first_name',
					type: "text",
					name: 'first_name',
					value: '',
					onBlur: () => {
						this.checkFormValidity()
					},
					validateRule: "name",
				}
			}),
			SecondNameLabel: new Label({
				label: "Фамилия",
				className: 'profile',
				inputProps: {
					id: 'second_name',
					type: "text",
					name: 'second_name',
					value: '',
					onBlur: () => {
						this.checkFormValidity()
					},
					validateRule: "name",
				}
			}),
			DisplayNameLabel: new Label({
				label: "Имя в чате",
				className: 'profile',
				inputProps: {
					id: 'display_name',
					type: "text",
					name: 'display_name',
					value: '',
					onBlur: () => {
						this.checkFormValidity()
					},
					validateRule: "name",
				}
			}),
			PhoneLabel: new Label({
				label: "Телефон",
				className: 'profile',
				inputProps: {
					id: 'phone',
					type: "tel",
					name: 'phone',
					value: '',
					onBlur: () => {
						this.checkFormValidity()
					},
					validateRule: "phone",
				}
			}),
			SubmitButton: new Button({
				type: 'submit',
				id: 'submit',
				child: 'Сохранить',
				className: 'profile__submit-button',
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					const data: Record<string, string> = {}
					for (const children in this.children) {
						const inputData = getFormData(this.children[children]);
						if (inputData) {
							data[inputData.name] = inputData.value;
						}
					}
					const isFormValid = this.checkFormValidity(true)
					if (isFormValid) {
						if (!data.oldPassword) {
							profileController.updateProfile(data as IProfile)
								.then((userData) => {
									store.set("user", userData)
									this.handleSubmitClick()
								})
						} else {
							profileController.changePassword(data.oldPassword, data.newPassword)
								.then(() => {
									this.handleSubmitClick()
								})
						}
					}
				}
			}),
			EditingProfileLink: new Link({
				href: '#',
				text: 'Изменить данные',
				className: 'profile__link',
				dataAction: 'isEditingProfile',
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					this.handleLinkClick(e)
				}
			}),
			ChangingPasswordLink: new Link({
				href: '#',
				text: 'Изменить пароль',
				className: 'profile__link',
				dataAction: 'isEditingProfile isChangingPassword',
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					this.handleLinkClick(e)
				}
			}),
			ExitProfileLink: new Link({
				href: '#',
				text: 'Выйти',
				className: 'profile__link',
				dataPage: '/',
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					profileController.logout()
						.then(() => {
							this.handleLinkClick(e)
						})
				}
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
						if (this.file) {
							const formData = new FormData
							formData.append('avatar', this.file)
							profileController.changeAvatar(formData)
								.then((data) => {
									if (data) {
										this.children.Avatar.setProps({src: `https://ya-praktikum.tech/api/v2/resources${data.avatar}`});
										const userData = store.getState().user as IUserData
										store.set("user", {...userData, avatar: data.avatar})
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
			isChangingPassword: false,
			isEditingProfile: false,
		});
		this.isChangingPassword = false
		this.isEditingProfile = false
		this.file = null
	}

	checkFormValidity(checkAllForm?: boolean): boolean {
		if (checkAllForm) {
			for (const key in this.children) {
				if (this.children[key] instanceof Label) {
					this.children[key].isValid()
				}
			}
		}
		const isFormValid = validateForm(this);
		this.children.SubmitButton.setAttributes({disabled: !isFormValid});
		return isFormValid
	}

	setCheckPasswordProps(value: string) {
		this.children.PasswordCheckLabel.setProps({customValidateRule: {rule: value, message: 'Пароли не совпадают'}})
		this.children.PasswordCheckLabel.children.InputElement.element?.dispatchEvent(new Event("blur"));
	}

	componentDidMount() {
		if (store.getState().user) {
			const user = store.getState().user as IUserData;
			this.children.EmailLabel.children.InputElement.setProps({value: user.email});
			this.children.LoginLabel.children.InputElement.setProps({value: user.login});
			this.children.NameLabel.children.InputElement.setProps({value: user.first_name});
			this.children.SecondNameLabel.children.InputElement.setProps({value: user.second_name});
			this.children.DisplayNameLabel.children.InputElement.setProps({value: user.display_name});
			this.children.PhoneLabel.children.InputElement.setProps({value: user.phone});
			this.children.Avatar.setProps({src: user.avatar ? `https://ya-praktikum.tech/api/v2/resources${user.avatar}` : "/images/avatar.png"});
		}
		this.setValidateInputs()
		this.setChildAttrs()
	}

	setChildAttrs() {
		for (const key in this.children) {
			if (this.children[key] instanceof Label) {
				this.children[key].children.InputElement.setAttributes({readonly: !this.isEditingProfile})
			}
		}
	}

	handleLinkClick(e: MouseEvent) {
		const target = e.target as HTMLAnchorElement;
		if (target.dataset?.page) {
			router.go(target.dataset.page);
		} else if (target.dataset.action) {
			const params = target.dataset.action.split(" ")
			params.forEach(param => {
				if (param === stateKeys.IS_EDITING_PROFILE || param === stateKeys.IS_CHANGING_PASSWORD) {
					this[param] = !this[param];
				}
			})
			this.setProps({
				isChangingPassword: this.isChangingPassword,
				isEditingProfile: this.isEditingProfile
			})
			this.setChildAttrs()
			this.setValidateInputs()
			this.checkFormValidity(true)
			this.render()
		}
	}

	handleSubmitClick() {
		this.setProps({
			isChangingPassword: false,
			isEditingProfile: false
		})
		this.isChangingPassword = false
		this.isEditingProfile = false
		this.setChildAttrs()
		this.setValidateInputs()
		this.render()
	}

	setValidateInputs() {
		if (this.props.isChangingPassword) {
			this.children.EmailLabel.setProps(ProfilePage.noValidateRule)
			this.children.LoginLabel.setProps(ProfilePage.noValidateRule)
			this.children.NameLabel.setProps(ProfilePage.noValidateRule)
			this.children.SecondNameLabel.setProps(ProfilePage.noValidateRule)
			this.children.DisplayNameLabel.setProps(ProfilePage.noValidateRule)
			this.children.PhoneLabel.setProps(ProfilePage.noValidateRule)
			this.children.OldPasswordLabel.setProps({customValidateRule: null})
			this.children.NewPasswordLabel.setProps({customValidateRule: null})
			this.children.PasswordCheckLabel.setProps({customValidateRule: null})
		} else {
			this.children.EmailLabel.setProps({customValidateRule: null})
			this.children.LoginLabel.setProps({customValidateRule: null})
			this.children.NameLabel.setProps({customValidateRule: null})
			this.children.SecondNameLabel.setProps({customValidateRule: null})
			this.children.DisplayNameLabel.setProps({customValidateRule: null})
			this.children.PhoneLabel.setProps({customValidateRule: null})
			this.children.OldPasswordLabel.setProps(ProfilePage.noValidateRule)
			this.children.NewPasswordLabel.setProps(ProfilePage.noValidateRule)
			this.children.PasswordCheckLabel.setProps(ProfilePage.noValidateRule)
		}
	}

	setFileName(fileName: string): void {
		this.children.ModalAvatar.setProps({description: fileName})
	}

	setAvatarButtonDisabled(disabled: boolean): void {
		this.children.ModalAvatar.children.Button.setAttributes({disabled});
	}

	render() {
		return `
				<section class="page page_sidebar page_path_profile">
						{{{ Sidebar }}}
						<div class="profile">
								<div class="profile__wrapper">
										<div class="profile__avatar-wrapper">
												{{{ Avatar }}}
												{{{ AvatarButton }}}
										</div>
										<p class="profile__user-name">{{display_name}}</p>
										<form class="profile__form">
												{{#if isChangingPassword}}
														{{{ OldPasswordLabel }}}
														{{{ NewPasswordLabel }}}
														{{{ PasswordCheckLabel }}}
												{{^}}
														{{{ EmailLabel }}}
														{{{ LoginLabel }}}
														{{{ NameLabel }}}
														{{{ SecondNameLabel }}}
														{{{ DisplayNameLabel }}}
														{{{ PhoneLabel }}}
												{{/if}}
												<div class="profile__actions">
														{{#if isEditingProfile}}
																{{{ SubmitButton }}}
														{{^}}
																{{{ EditingProfileLink }}}
																{{{ ChangingPasswordLink }}}
																{{{ ExitProfileLink }}}
														{{/if}}
												</div>
										</form>
								</div>
						</div>
						{{{ ModalAvatar }}}
				</section>
		`;
	}
}

export default connect((state) => ({
	user: state.user
}))(ProfilePage);
