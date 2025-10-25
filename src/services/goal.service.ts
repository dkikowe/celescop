import { api } from '../lib/axios'

class GoalService {
	async createGoal(formData: FormData) {
		return await api.post(`/goal/create`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
	}

	async createGoalFromTemplate(formData: FormData) {
		return await api.post(`/goal/create-from-template`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
	}

	async getGoals() {
		return await api.get('/goal')
	}

	async getGoal(id: number) {
		return await api.get(`/goal/${id}`)
	}

	async updateGoal(id: number, formData: FormData) {
		return await api.put(`/goal/${id}`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
	}

	async completeSubGoal(id: number) {
		return await api.post(`/goal/sub-goal/${id}/complete`)
	}

	async uncompleteSubGoal(id: number) {
		return await api.post(`/goal/sub-goal/${id}/uncomplete`)
	}

	async completeGoal(id: number, formData: FormData) {
		return await api.post(`/goal/${id}/complete`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
	}
}

export const goalService = new GoalService()
