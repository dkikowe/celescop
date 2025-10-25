import { UseFormRegister } from 'react-hook-form'
import { Block } from '../ui/block'

export function CreateGoalRelevant({
	register,
}: {
	register: UseFormRegister<any>
}) {
	return (
		<Block
			titleSize={14}
			popup={
				<span>
					Например, если брать сокращение штата занятых на исполнении
					автоматизированных операций сотрудников на 80%, то сотрудников можно
					не увольнять, а перевести на другие должности, на которых эти
					сотрудник смогут принести компании доход, а не только экономию.
				</span>
			}
			title='4. Relevant (Актуальность) Зачем тебе нужна эта цель?'
		>
			<div className='w-full px-4'>
				<textarea
					{...register('relevant')}
					required
					className='border-b-1 border-[#2F51A8] w-full outline-none resize-none h-20'
				/>
			</div>
		</Block>
	)
}
