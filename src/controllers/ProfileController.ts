import ProfileApi, {IProfile} from "../api/ProfileApi";

class ProfileController {
	public async updateProfile({first_name, second_name, display_name, login, email, phone}: IProfile): Promise<Promise<null | undefined> | void> {
		try {
			const res = await ProfileApi.update({first_name, second_name, display_name, login, email, phone});
			if (res.status !== 200) {
				return null
			}
			return JSON.parse(res.responseText);
		} catch (error) {
			console.error("Error during get chats:", error);
		}
	}

	public async changePassword(oldPassword: string, newPassword: string): Promise<Promise<null | undefined> | void> {
		try {
			const res = await ProfileApi.updatePassword(oldPassword, newPassword);
			if (res.status !== 200) {
				return null
			}
		} catch (error) {
			console.error("Error during get chats:", error);
		}
	}

	public async changeAvatar(formData: FormData) {
		try {
			const res = await ProfileApi.updateAvatar(formData)
			if (res.status !== 200) {
				return null
			}
			return JSON.parse(res.responseText)
		} catch (error) {
			console.error("Error during create chat:", error);
		}
	}

	public async logout(): Promise<Promise<null | undefined> | void> {
		try {
			const res = await ProfileApi.logout()
			if (res.status !== 200) {
				return null
			}
		} catch (error) {
			console.error("Error during create chat:", error);
		}
	}
}

export default new ProfileController();
