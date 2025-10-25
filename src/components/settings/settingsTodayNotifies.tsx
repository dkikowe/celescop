import { useState } from 'react'
import Popup from 'reactjs-popup'
import { Button } from '../ui/button'
import Switch from '../ui/switch'
import { CheckIcon } from 'lucide-react'
import { useChangeSettings } from '../../hooks/useChangeSettings'

export function SettingsTodayNotifies({ settings }: { settings: any }) {
	const { mutateAsync: changeSettings } = useChangeSettings()

	const [todaySubGoalsNotificationsTime, setTodaySubGoalsNotificationsTime] =
		useState<string>(settings?.todaySubGoalsNotificationsTime ?? '09:00')

	const [todaySubGoalsNotifications, setTodaySubGoalsNotifications] =
		useState<boolean>(settings?.todaySubGoalsNotifications ?? true)

	return (
		<div className='relative p-[3px] rounded-xl'>
			<div
				className='absolute inset-0 rounded-lg'
				style={{
					background: 'linear-gradient(90deg, #2F51A8 0%, #122042 100%)',
				}}
			/>
			<div className='relative bg-white flex items-center justify-between rounded-md py-1.5 px-3'>
				<Popup
					trigger={
						<p className='underline text-sm'>Уведомлять по задачам на день</p>
					}
					closeOnDocumentClick
					position='top left'
					contentStyle={{ width: '70%' }}
					arrow={false}
				>
					<div className='flex items-center justify-around'>
						<input
							type='time'
							name='todaySubGoalsNotificationsTime'
							id='todaySubGoalsNotificationsTime'
							value={todaySubGoalsNotificationsTime}
							onChange={e => setTodaySubGoalsNotificationsTime(e.target.value)}
						/>
						<Button
							onClick={() => changeSettings({ todaySubGoalsNotificationsTime })}
						>
							<CheckIcon />
						</Button>
					</div>
				</Popup>
				<Switch
					className='scale-120'
					checked={todaySubGoalsNotifications}
					onChange={checked => {
						setTodaySubGoalsNotifications(checked)
						changeSettings({ todaySubGoalsNotifications: checked })
					}}
				/>
			</div>
		</div>
	)
}
