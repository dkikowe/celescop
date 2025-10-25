import { useQuery } from '@tanstack/react-query'
import { friendshipService } from '../services/friendship.service'

export function useGetFriends() {
	return useQuery({
		queryKey: ['friends'],
		queryFn: async () => {
			const res = await friendshipService.getFriends()
			return res.data
		},
	})
}

export function useGetFriendsGoals() {
	return useQuery({
		queryKey: ['friends-goals'],
		queryFn: async () => {
			const res = await friendshipService.getFriendsGoals()
			return res.data
		},
	})
}
