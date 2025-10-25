import { TOKEN } from '../../types/enum'

export const getAccessToken = () => localStorage.getItem(TOKEN.ACCESS_TOKEN)
export const setAccessToken = (i: string) =>
	localStorage.setItem(TOKEN.ACCESS_TOKEN, i)
