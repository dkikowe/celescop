import { useState } from 'react'
import Popup from 'reactjs-popup'
import { Button } from '../ui/button'
import Switch from '../ui/switch'
import { CheckIcon } from 'lucide-react'
import { useChangeSettings } from '../../hooks/useChangeSettings'

export function SettingsMonthlyNotifies({ settings }: { settings: any }) {
	const { mutateAsync: changeSettings } = useChangeSettings()

	const [monthlyGoalDeadlineNotificationsTime, setMonthlyGoalDeadlineNotificationsTime] =
		useState<string>(settings?.monthlyGoalDeadlineNotificationsTime ?? '09:00')

	const [monthlyGoalDeadlineNotifications, setMonthlyGoalDeadlineNotifications] =
		useState<boolean>(settings?.monthlyGoalDeadlineNotifications ?? true)

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
						<p className='underline text-sm'>Уведомлять по задачам на месяц</p>
					}
					closeOnDocumentClick
					position='top left'
					contentStyle={{ width: '70%' }}
					arrow={false}
				>
					<div className='flex items-center justify-around'>
						<input
							type='time'
							name='monthlyGoalDeadlineNotificationsTime'
							id='monthlyGoalDeadlineNotificationsTime'
							value={monthlyGoalDeadlineNotificationsTime}
							onChange={e =>
								setMonthlyGoalDeadlineNotificationsTime(e.target.value)
							}
						/>
						<Button
							onClick={() => changeSettings({ monthlyGoalDeadlineNotificationsTime })}
						>
							<CheckIcon />
						</Button>
					</div>
				</Popup>
				<Switch
					className='scale-120'
					checked={monthlyGoalDeadlineNotifications}
					onChange={checked => {
						setMonthlyGoalDeadlineNotifications(checked)
						changeSettings({ monthlyGoalDeadlineNotifications: checked })
					}}
				/>
			</div>
		</div>
	)
}
