import { useState, useEffect } from 'react'
import Popup from 'reactjs-popup'
import { Button } from '../ui/button'
import Switch from '../ui/switch'
import { CheckIcon } from 'lucide-react'
import { useChangeSettings } from '../../hooks/useChangeSettings'

export function CustomNotifies({ settings }: { settings: any }) {
	console.log(settings)
	const { mutateAsync: changeSettings } = useChangeSettings()

	const [customNotificationsTime, setCustomNotificationsTime] =
		useState<string>(settings?.customNotificationsTime ?? '09:00')

	const [customNotifications, setCustomNotifications] = useState<boolean>(
		settings?.customNotifications ?? true
	)

	useEffect(() => {
		setCustomNotificationsTime(settings?.customNotificationsTime ?? '09:00')
		setCustomNotifications(settings?.customNotifications ?? true)
	}, [settings])

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
						<p className='underline text-sm'>Произвольные уведомления</p>
					}
					closeOnDocumentClick
					position='top left'
					contentStyle={{ width: '70%' }}
					arrow={false}
				>
					<div className='flex items-center justify-around'>
						<input
							type='time'
							name='customNotificationsTime'
							id='customNotificationsTime'
							value={customNotificationsTime}
							onChange={e => setCustomNotificationsTime(e.target.value)}
						/>
						<Button onClick={() => changeSettings({ customNotificationsTime })}>
							<CheckIcon />
						</Button>
					</div>
				</Popup>
				<Switch
					className='scale-120'
					checked={customNotifications}
					onChange={checked => {
						setCustomNotifications(checked)
						changeSettings({ customNotifications: checked })
					}}
				/>
			</div>
		</div>
	)
}
