import { UseFormRegister } from 'react-hook-form'
import { Block } from '../ui/block'

export function CreateGoalMeasurable({
	register,
}: {
	register: UseFormRegister<any>
}) {
	return (
		<Block
			titleSize={14}
			popup={
				<span>
					Если показатель количественный, то нужны единицы измерения, если
					качественный, то нужен эталон отношения. Например, увеличить прибыль
					своего предприятия на 25%, относительно чистой прибыли предыдущего
					года.
				</span>
			}
			title='2. Measurable (Измеримость) Объясни, в чем будет измеряться результат'
		>
			<div className='w-full px-4'>
				<textarea
					{...register('measurable')}
					required
					className='border-b-1 border-[#2F51A8] w-full outline-none resize-none h-20'
				/>
			</div>
		</Block>
	)
}
