import Block from "../../utils/Block";
import {Sidebar} from "../../components/Sidebar/Sidebar";
import {Avatar} from "../../components/Avatar/Avatar";
import {Button} from "../../components/Button/Button";
import {Label} from "../../components/Label/Label";
import {getFormData, validateForm} from "../../utils/helpers";
import {Link} from "../../components/Link/Link";

enum stateKeys {
	IS_EDITING_PROFILE = "isEditingProfile",
	IS_CHANGING_PASSWORD = "isChangingPassword",
}

export class ProfilePage extends Block {
	static noValidateRule = {
		customValidateRule: {
			rule: '.*',
			message: ' ',
		}
	}
	private readonly changePage: (page: string) => void;
	private isChangingPassword: boolean;
	private isEditingProfile: boolean;

	constructor(changePage: (page: string) => void, userData: Record<string, string>) {
		super({
			...userData,
			Sidebar: new Sidebar(changePage),
			Avatar: new Avatar({
				className: 'profile__avatar',
				src: userData.avatar
			}),
			AvatarButton: new Button({
				child: 'Поменять аватар',
				className: 'profile__avatar-button',
				type: 'button',
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
					value: userData.email,
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
					value: userData.login,
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
					value: userData.first_name,
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
					value: userData.second_name,
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
					value: userData.display_name,
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
					value: userData.phone,
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
						console.log(data)
						this.handleSubmitClick()
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
				dataPage: '/signIn',
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					this.handleLinkClick(e)
				}
			}),
			isChangingPassword: false,
			isEditingProfile: false,
		});
		this.changePage = changePage
		this.isChangingPassword = false
		this.isEditingProfile = false
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
			this.changePage(target.dataset.page);
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
				</section>
		`;
	}
}
