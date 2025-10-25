import { InitData } from '@telegram-apps/sdk'

export function RegisterUsername({ user }: { user: InitData['user'] }) {
	return (
		<>
			<table className='w-full text-left text-white'>
				<thead
					style={{
						background: 'linear-gradient(90deg, #27448D 0%, #0B1327 100%)',
					}}
				>
					<tr>
						<th className='px-5'>Логин публичный</th>
					</tr>
				</thead>
				<tbody className='text-black'>
					<tr>
						<td className='py-1 font-bold px-5'>{user?.username}</td>
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
