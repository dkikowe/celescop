import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { userService } from '../services/user.service'
import { useAuthStore } from '../store/auth.store'

export function useEditUser(cb?: () => void) {
	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string
			data: {
				firstName?: string
				lastName?: string
				username?: string
			}
		}) => {
			const res = await userService.editUser(id, data)
			if (!res.data) Promise.reject()
			return res
		},
		onSuccess: data => {
			toast.success('Успешно!')
			useAuthStore.setState({ user: data.data })
			cb?.()
		},
	})
}
