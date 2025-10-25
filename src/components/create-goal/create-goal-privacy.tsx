import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { Block } from '../ui/block'

export function CreateGoalPrivacy({
	setValue,
	watch,
}: {
	setValue: UseFormSetValue<any>
	watch: UseFormWatch<any>
}) {
	const currentPrivacy = watch('privacy')

	return (
		<Block title='Хотите ли транслировать выполнение цели друзьям?'>
			<div className='w-full px-4 flex items-center gap-4 justify-center flex-wrap'>
				<div className='flex items-center gap-2 text-sm'>
					<input
						name='privacy'
						type='radio'
						id='private'
						checked={currentPrivacy === 'PRIVATE'}
						onChange={e => e.target.checked && setValue('privacy', 'PRIVATE')}
						className='w-6 h-6 accent-black'
					/>
					<label htmlFor='private'>Личная</label>
				</div>
				<div className='flex items-center gap-2 text-sm'>
					<input
						name='privacy'
						type='radio'
						id='public'
						checked={currentPrivacy === 'PUBLIC'}
						onChange={e => e.target.checked && setValue('privacy', 'PUBLIC')}
						className='w-6 h-6 accent-black'
					/>
					<label htmlFor='public'>Открытая</label>
				</div>
			</div>
		</Block>
	)
}
