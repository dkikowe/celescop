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
		// НЕ устанавливаем Content-Type вручную - браузер сам установит multipart/form-data с boundary
		console.log(`📤 PUT /user/edit-photo/${id}`)
		for (const [key, value] of formData.entries()) {
			if (value instanceof File) {
				console.log(`  ${key}:`, { name: value.name, size: value.size, type: value.type })
			} else {
				console.log(`  ${key}:`, value)
			}
		}
		return await api.put<IUser>(`/user/edit-photo/${id}`, formData)
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
