import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/user.service'
import toast from 'react-hot-toast'

export function useChangeSettings() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (data: any) => {
			const res = await userService.changeSettings(data)
			if (res.status === 200) {
				toast.success('Настройки успешно изменены')
				queryClient.invalidateQueries({ queryKey: ['settings'] })
			}
			return res.data
		},
	})
}

export function useGetSettings() {
	return useQuery({
		queryKey: ['settings'],
		queryFn: async () => {
			const res = await userService.getSettings()
			return res.data
		},
	})
}
