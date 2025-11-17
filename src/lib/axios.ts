import axios from 'axios'
import { toast } from 'react-hot-toast'
import { getAccessToken } from '../services/auth/auth.helper'
import { authService } from '../services/auth/auth.service'

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
    // Не выставляем Content-Type глобально, чтобы FormData устанавливал boundary автоматически
})

api.interceptors.request.use(config => {
	const accessToken = getAccessToken()
	if (accessToken && config) {
		config.headers['Authorization'] = `Bearer ${accessToken}`
	}
	return config
})

api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config

		if (
			(error?.response?.status === 401 || error?.response?.status === 403) &&
			!originalRequest?._isRetry &&
			!error.response.request.responseURL.includes('refresh')
		) {
			originalRequest._isRetry = true
			try {
				await authService.refresh()

				return api.request(originalRequest)
			} catch (refreshError) {
				toast('Случилась ошибка. Пожалуйста, перезагрузите страницу.')
				return Promise.reject(refreshError)
			}
		}

		// Подробное логирование для отладки
		console.group('🔴 API Error')
		console.error('URL:', error?.config?.url)
		console.error('Method:', error?.config?.method)
		console.error('Status:', error?.response?.status)
		console.error('Response data:', error?.response?.data)
		console.error('Full error:', error)
		console.groupEnd()

		// Показываем сообщение об ошибке
		if (error?.response) {
			const status = error.response.status
			if (status !== 401 && status !== 403) {
				// Пытаемся извлечь сообщение из разных возможных форматов ответа
				let message = 'Неизвестная ошибка'
				
				if (typeof error.response.data === 'string') {
					message = error.response.data
				} else if (error.response.data?.message) {
					message = error.response.data.message
				} else if (error.response.data?.error) {
					message = error.response.data.error
				} else if (Array.isArray(error.response.data?.errors)) {
					message = error.response.data.errors.join(', ')
				}
				
				// Добавляем статус код для дополнительной информации
				const displayMessage = status >= 500 
					? `Ошибка сервера (${status}): ${message}`
					: message
				
				console.error('Showing toast:', displayMessage)
				toast.error(displayMessage)
			}
		} else if (error?.request) {
			// Ошибка сети - запрос был отправлен, но ответа не получено
			console.error('Network error - no response received')
			toast.error('Ошибка сети. Проверьте интернет-соединение.')
		} else {
			// Ошибка при настройке запроса
			console.error('Request setup error:', error?.message)
			toast.error('Ошибка при отправке запроса: ' + (error?.message || 'неизвестная ошибка'))
		}

		// Важно: возвращаем rejected Promise, чтобы ошибка попала в catch блоки
		return Promise.reject(error)
	}
)
