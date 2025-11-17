import { api } from '../lib/axios'

class GoalService {
	async createGoal(formData: FormData) {
		console.log('📤 POST /goal/create')
		// Логируем содержимое FormData
		for (const [key, value] of formData.entries()) {
			if (value instanceof File) {
				console.log(`  ${key}:`, { name: value.name, size: value.size, type: value.type })
			} else {
				console.log(`  ${key}:`, value)
			}
		}
		return await api.post(`/goal/create`, formData)
	}

	async createGoalFromTemplate(formData: FormData) {
		console.log('📤 POST /goal/create-from-template')
		for (const [key, value] of formData.entries()) {
			if (value instanceof File) {
				console.log(`  ${key}:`, { name: value.name, size: value.size, type: value.type })
			} else {
				console.log(`  ${key}:`, value)
			}
		}
		return await api.post(`/goal/create-from-template`, formData)
	}

	async getGoals() {
		return await api.get('/goal')
	}

	async getGoal(id: number) {
		return await api.get(`/goal/${id}`)
	}

	async updateGoal(id: number, formData: FormData) {
		console.log(`📤 PUT /goal/${id}`)
		for (const [key, value] of formData.entries()) {
			if (value instanceof File) {
				console.log(`  ${key}:`, { name: value.name, size: value.size, type: value.type })
			} else {
				console.log(`  ${key}:`, value)
			}
		}
		return await api.put(`/goal/${id}`, formData)
	}

	async completeSubGoal(id: number) {
		return await api.post(`/goal/sub-goal/${id}/complete`)
	}

	async uncompleteSubGoal(id: number) {
		return await api.post(`/goal/sub-goal/${id}/uncomplete`)
	}

	async completeGoal(id: number, formData: FormData) {
		// НЕ устанавливаем Content-Type вручную - браузер сам установит multipart/form-data с boundary
		console.log(`📤 POST /goal/${id}/complete`)
		for (const [key, value] of formData.entries()) {
			if (value instanceof File) {
				console.log(`  ${key}:`, { name: value.name, size: value.size, type: value.type })
			} else {
				console.log(`  ${key}:`, value)
			}
		}
		return await api.post(`/goal/${id}/complete`, formData)
	}
}

export const goalService = new GoalService()
