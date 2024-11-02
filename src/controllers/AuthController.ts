import authApi, { ISignInData, ISignUpData } from "../api/AuthApi";
import store from "../utils/Store";

class UserAuthController {
	public async signIn(data: ISignInData): Promise<Promise<null | undefined> | void> {
		try {
			const res = await authApi.signIn(data);
			if (res.status !== 200) {
				return null
			}
			const user = await this.getUser();
			if (user) {
				const userData = JSON.parse(user.responseText);
				store.set('user', userData);
			}
		} catch (error) {
			console.error("Error during sign-in:", error);
		}
	}

	public async signUp(data: ISignUpData) {
		try {
			await authApi.signUp(data);
			const user = await this.getUser();

			if (user) {
				const userData = JSON.parse(user.responseText);
				store.set('user', userData);
			}
		} catch (error) {
			console.error("Error during sign-up:", error);
		}
	}

	async getUser(): Promise<XMLHttpRequest | undefined> {
		try {
			return await authApi.getUser();
		} catch (error) {
			console.error("Error fetching user:", error);
			return undefined; // Ensure we return `undefined` in case of an error
		}
	}
}

export default new UserAuthController();
