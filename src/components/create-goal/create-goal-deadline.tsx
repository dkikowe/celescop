import { UseFormSetValue } from 'react-hook-form'
import { Block } from '../ui/block'

export function CreateGoalDeadline({
	setValue,
}: {
	setValue: UseFormSetValue<any>
}) {
	return (
		<Block title='Срок выполнение цели*'>
			<div className='w-full px-4 flex items-center gap-4 justify-center flex-wrap'>
				<div className='flex items-center gap-2 text-sm'>
					<input
						name='deadline'
						type='radio'
						id='3-months'
						defaultChecked
						onChange={e => e.target.checked && setValue('deadline', '3_MONTHS')}
						required
						className='w-6 h-6 accent-black'
					/>
					<label htmlFor='3-months'>3 месяца</label>
				</div>
				<div className='flex items-center gap-2 text-sm'>
					<input
						name='deadline'
						type='radio'
						id='6-months'
						onChange={e => e.target.checked && setValue('deadline', '6_MONTHS')}
						className='w-6 h-6 accent-black'
					/>
					<label htmlFor='6-months'>6 месяца</label>
				</div>
				<div className='flex items-center gap-2 text-sm'>
					<input
						name='deadline'
						type='radio'
						id='1-year'
						onChange={e => e.target.checked && setValue('deadline', '1_YEAR')}
						className='w-6 h-6 accent-black'
					/>
					<label htmlFor='1-year'>1 год</label>
				</div>
			</div>
		</Block>
	)
}
