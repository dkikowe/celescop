import { UseFormRegister } from 'react-hook-form'
import { Block } from '../ui/block'

export function CreateGoalAttainable({
	register,
}: {
	register: UseFormRegister<any>
}) {
	return (
		<Block
			titleSize={14}
			popup={
				<span>
					Возможно ли ее достигнуть вообще? Например, увеличить прибыл своего
					предприятия на 25%, относительно чистой прибыли предыдущего года, за
					счет снижения себестоимости продукции, автоматизации ресурсоемких
					операций и сокращения штата занятых на исполнении автоматизируемых
					операций сотрудников на 80% от текущего количества.
				</span>
			}
			title='3. Attainable (Достижимость) Объясни, за счет чего планируется достигнуть цели'
		>
			<div className='w-full px-4'>
				<textarea
					{...register('attainable')}
					required
					className='border-b-1 border-[#2F51A8] w-full outline-none resize-none h-20'
				/>
			</div>
		</Block>
	)
}
