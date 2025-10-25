import { InitData } from '@telegram-apps/sdk'
import { api } from '../../lib/axios'
import { useAuthStore } from '../../store/auth.store'
import { setAccessToken } from './auth.helper'

class AuthService {
	async auth(data: { initData: InitData }) {
		const res = await api.post('/auth/telegram', data)
		if (res?.data) {
			useAuthStore.setState({ user: res.data.user, isAuth: true })
			setAccessToken(res.data.accessToken)
			return res
		}
		throw new Error()
	}

	async refresh() {
		try {
			const res = await api.post('/auth/refresh')
			if (res?.data) {
				setAccessToken(res.data.accessToken)
				useAuthStore.setState({ user: res.data.user, isAuth: true })
				return res
			}
			throw new Error()
		} catch {}
	}
}

export const authService = new AuthService()
