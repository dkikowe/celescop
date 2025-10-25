import { create } from 'zustand'
import { IUser } from '../types/user'

interface IAuthState {
	isAuth: boolean
	user: IUser | null
	setIsAuth: (isAuth: boolean) => void
	setUser: (user: IUser) => void
}

export const useAuthStore = create<IAuthState>(set => ({
	isAuth: false,
	user: null,
	setIsAuth: isAuth => set({ isAuth }),
	setUser: user => set({ user }),
}))
