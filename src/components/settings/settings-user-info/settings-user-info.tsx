import { useAuthStore } from '../../../store/auth.store'
import { Dialog } from '../../ui/dialog'
import { SettingsEditName } from './settings-edit-name'
import { SettingsEditPhoto } from './settings-edit-photo'

export function SettingsUserInfo() {
	const { user } = useAuthStore()
	return (
		<div className='py-8 px-4 flex items-center gap-5 max-[330px]:gap-3'>
			<Dialog
				title='Сменить Фото'
				trigger={
					<div className='flex items-center flex-col gap-1 translate-y-3'>
						<img
							className='w-[80px] h-[80px] max-[390px]:w-[70px] max-[390px]:h-[70px] aspect-square rounded-full'
							src={user?.photoUrl}
						/>
						<span className='text-sm'>Сменить фото</span>
					</div>
				}
			>
				<SettingsEditPhoto />
			</Dialog>

			<div className='flex flex-col'>
				<h2 className='font-bold text-xl max-[390px]:text-lg'>
					{user?.lastName} {user?.firstName}
				</h2>
				<ul className='text-sm flex items-center gap-4 max-[351px]:gap-2 max-[351px]:text-[13px]'>
					<li>
						<Dialog
							title='Сменить Имя'
							trigger={<button className='cursor-pointer'>Сменить Имя</button>}
						>
							<SettingsEditName />
						</Dialog>
					</li>
				</ul>
			</div>
		</div>
	)
}
