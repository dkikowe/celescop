import { api } from '../lib/axios'
import { IUser } from '../types/user'

class UserService {
	async editUser(
		id: string,
		data: {
			firstName?: string
			lastName?: string
			username?: string
		}
	) {
		return await api.put<IUser>(`/user/edit/${id}`, data)
	}

	async editUserPhoto(id: string, formData: FormData) {
		return await api.put<IUser>(`/user/edit-photo/${id}`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
	}

	async getUser(id: string) {
		return await api.get<IUser>(`/user/${id}`)
	}

	async changeSettings(data: any) {
		return await api.put('/settings/edit', data)
	}

	async getSettings() {
		return await api.get('/settings')
	}
}

export const userService = new UserService()
