import { InitData } from '@telegram-apps/sdk'

export function RegisterUserInfo({ user }: { user: InitData['user'] }) {
	return (
		<div className='py-8 px-4 flex items-center gap-5 max-[330px]:gap-3'>
			<img
				className='w-[100px] h-[100px] aspect-square rounded-full'
				src={user?.photo_url}
			/>
			<div className='flex flex-col'>
				<h2 className='font-bold text-xl'>
					{user?.last_name} {user?.first_name}
				</h2>
			</div>
		</div>
	)
}
