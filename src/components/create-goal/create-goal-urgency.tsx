import clsx from 'clsx'
import { URGENCY_COLORS } from '../home/home-list-item'
import { Block } from '../ui/block'
import { UseFormSetValue, UseFormWatch } from 'react-hook-form'

export function CreateGoalUrgency({
	setValue,
	watch,
}: {
	setValue: UseFormSetValue<any>
	watch: UseFormWatch<any>
}) {
	return (
		<Block title='Важность цели'>
			<div className='flex items-center gap-4 flex-wrap justify-center'>
				<div className='flex items-center gap-2'>
					<button
						type='button'
						onClick={() => setValue('urgencyLevel', 'LOW')}
						className={clsx('w-10 max-[400px]:w-6 aspect-square rounded-full', {
							'border-2 border-[#2F51A8]': watch('urgencyLevel') === 'LOW',
						})}
						style={{ backgroundColor: URGENCY_COLORS['low'] }}
					/>{' '}
					<span
						onClick={() => setValue('urgencyLevel', 'LOW')}
						className='text-sm'
					>
						Желаемая
					</span>
				</div>
				<div className='flex items-center gap-2'>
					<button
						type='button'
						onClick={() => setValue('urgencyLevel', 'AVERAGE')}
						className={clsx('w-10 max-[400px]:w-6 aspect-square rounded-full', {
							'border-2 border-[#2F51A8]': watch('urgencyLevel') === 'AVERAGE',
						})}
						style={{ backgroundColor: URGENCY_COLORS['average'] }}
					/>{' '}
					<span
						onClick={() => setValue('urgencyLevel', 'AVERAGE')}
						className='text-sm'
					>
						Нужная
					</span>
				</div>
				<div className='flex items-center gap-2'>
					<button
						type='button'
						onClick={() => setValue('urgencyLevel', 'HIGH')}
						className={clsx('w-10 max-[400px]:w-6 aspect-square rounded-full', {
							'border-2 border-[#2F51A8]': watch('urgencyLevel') === 'HIGH',
						})}
						style={{ backgroundColor: URGENCY_COLORS['high'] }}
					/>{' '}
					<span
						onClick={() => setValue('urgencyLevel', 'HIGH')}
						className='text-sm'
					>
						Важная
					</span>
				</div>
			</div>
		</Block>
	)
}
