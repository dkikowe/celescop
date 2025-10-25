import toast from 'react-hot-toast'
import { api } from '../lib/axios'
import { IUser } from '../types/user'

class FriendshipService {
	async createFriendship(friendId: string) {
		const res = await api.post('/friendship/add', { friendId })
		if (res.status === 200) toast.success('Друг успешно добавлен!')
		return res
	}

	async getFriends() {
		const res = await api.get<IUser[]>('/friendship')
		return res
	}

	async getFriendsGoals() {
		const res = await api.get<any[]>('/goal/friends')
		return res
	}
}

export const friendshipService = new FriendshipService()
