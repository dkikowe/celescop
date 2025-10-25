import toast from 'react-hot-toast'
import { useAuthStore } from '../../../store/auth.store'
import { SettingsEditUsername } from './settings-edit-username'
import { Dialog } from '../../ui/dialog'

export function SettingsUserName() {
	const { user } = useAuthStore()
	return (
		<>
			<table className='w-full text-center text-white'>
				<thead
					style={{
						background: 'linear-gradient(90deg, #27448D 0%, #0B1327 100%)',
					}}
				>
					<tr>
						<th>Логин публичный</th>
						<th className='text-xs border-l'>
							<button
								className='cursor-pointer'
								onClick={() => {
									navigator.clipboard.writeText(user?.username || '')
									toast.success('Скопировано!')
								}}
							>
								Копировать
							</button>
						</th>
						<th className='text-xs border-l'>
							<Dialog title='Сменить логин' trigger={<button>Изменить</button>}>
								<SettingsEditUsername />
							</Dialog>
						</th>
					</tr>
				</thead>
				<tbody className='text-black'>
					<tr>
						<td className='py-1 font-bold'>{user?.username}</td>
					</tr>
				</tbody>
			</table>
			<hr
				className='h-[1px]'
				style={{
					background: 'linear-gradient(90deg, #2F51A8 0%, #122042 100%)',
				}}
			/>
		</>
	)
}
