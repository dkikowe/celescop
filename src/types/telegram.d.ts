declare global {
	interface TelegramWebApp {
		initData: string
		initDataUnsafe: {
			start_param: string
		}
	}

	interface Window {
		Telegram: {
			WebApp: TelegramWebApp
		}
	}
}

export {}
