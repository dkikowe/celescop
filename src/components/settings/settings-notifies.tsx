import { useGetSettings } from '../../hooks/useChangeSettings'
import { SettingsTodayNotifies } from './settingsTodayNotifies'
import { SettingsTomorrowNotifies } from './settingsTomorrowNotifies'
import { SettingsMonthlyNotifies } from './settingsMonthlyNotifies'
import { CustomNotifies } from './customNotifies'

export function SettingsNotifies() {
	const { data: settings } = useGetSettings()

	return (
		<details className='mt-5' open>
			<summary
				className='text-white px-2 h-min p-0.5 text-center appearance-none bg-[#27448D]'
				style={{
					background: 'linear-gradient(90deg, #27448D 0%, #0B1327 100%)',
				}}
			>
				Настройка уведомлений
			</summary>
			<div className='flex flex-col px-4 gap-6 mt-6'>
				<SettingsTodayNotifies settings={settings} />
				<SettingsTomorrowNotifies settings={settings} />
				<SettingsMonthlyNotifies settings={settings} />
				<CustomNotifies settings={settings} />
			</div>
		</details>
	)
}
