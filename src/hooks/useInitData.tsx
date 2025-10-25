import { InitData } from '@telegram-apps/sdk'
import { createContext, useContext } from 'react'

const initDataContext = createContext<InitData | null>(null)

export const useInitData = () => useContext(initDataContext)
export const InitDataContextProviver = initDataContext.Provider
