import {
	Bar,
	BarChart,
	Line,
	LineChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from 'recharts'
import { useGetGoals } from '../../hooks/useGoal'
import { Goal } from '../../types/goal'
import { useMemo } from 'react'

export function HomeStatistics() {
	const { data: goalsData, isLoading, error } = useGetGoals()
	
	// Подготавливаем данные для графика прогресса целей
	const barChartData = useMemo(() => {
		if (!goalsData?.data) return []
		
		// Фильтруем незавершенные цели и сортируем по дате создания (новые сверху)
		const data = goalsData.data
			.filter((goal: Goal) => !goal.isCompleted)
			.sort((a: Goal, b: Goal) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			.slice(0, 10)
			.map((goal: Goal, index: number) => {
				// Вычисляем процент выполнения на основе подцелей
				const totalSubGoals = goal.subGoals?.length || 0
				const completedSubGoals = goal.subGoals?.filter(sub => sub.isCompleted).length || 0
				
				let percent: number
				if (totalSubGoals === 0) {
					// Если у цели нет подзадач, считаем её выполненной на 100%
					percent = 100
				} else {
					// Если есть подзадачи, вычисляем процент выполнения
					percent = Math.round((completedSubGoals / totalSubGoals) * 100)
				}
				
				return {
					name: `№${index + 1}`,
					percent
				}
			})
			
		return data
	}, [goalsData])
	
	// Подготавливаем данные для графика выполненных подзадач по месяцам
	const lineChartData = useMemo(() => {
		if (!goalsData?.data) return []
		
		// Создаем массив для всех месяцев
		const months = [
			'Янв.', 'Фев.', 'Март', 'Апр.', 'Май', 'Июнь',
			'Июль', 'Авг.', 'Сент.', 'Окт.', 'Нояб.', 'Дек.'
		]
		
		// Инициализируем данные для каждого месяца
		const monthlyData = months.map(name => ({ name, subGoals: 0 }))
		
		// Подсчитываем выполненные подзадачи по месяцам
		goalsData.data.forEach((goal: Goal) => {
			if (goal.subGoals) {
				goal.subGoals.forEach(subGoal => {
					if (subGoal.isCompleted && subGoal.completedAt) {
						const completedDate = new Date(subGoal.completedAt)
						const monthIndex = completedDate.getMonth()
						monthlyData[monthIndex].subGoals++
					}
				})
			}
		})
		
		return monthlyData
	}, [goalsData])
	
	// Подсчитываем общее количество целей
	const totalGoals = goalsData?.data?.length || 0
	

	// Подсчитываем общее количество выполненных подзадач
	const totalCompletedSubGoals = useMemo(() => {
		if (!goalsData?.data) return 0
		return goalsData.data.reduce((total: number, goal: Goal) => {
			const completedSubGoals = goal.subGoals?.filter(sub => sub.isCompleted).length || 0
			return total + completedSubGoals
		}, 0)
	}, [goalsData])

	// Показываем индикатор загрузки
	if (isLoading) {
		return (
			<section className='font-bold text-lg w-full pt-2 px-4'>
				<div className='relative p-[3px] rounded-xl'>
					<div
						className='absolute inset-0 rounded-lg'
						style={{
							background: 'linear-gradient(90deg, #2F51A8 0%, #122042 100%)',
						}}
					/>
					<div className='relative bg-white rounded-md p-8 text-center'>
						<div className='text-lg'>Загрузка статистики...</div>
					</div>
				</div>
			</section>
		)
	}

	// Показываем ошибку
	if (error) {
		return (
			<section className='font-bold text-lg w-full pt-2 px-4'>
				<div className='relative p-[3px] rounded-xl'>
					<div
						className='absolute inset-0 rounded-lg'
						style={{
							background: 'linear-gradient(90deg, #2F51A8 0%, #122042 100%)',
						}}
					/>
					<div className='relative bg-white rounded-md p-8 text-center'>
						<div className='text-lg text-red-600'>Ошибка загрузки данных</div>
					</div>
				</div>
			</section>
		)
	}

	// Показываем сообщение, если нет данных
	if (!goalsData?.data || goalsData.data.length === 0) {
		return (
			<section className='font-bold text-lg w-full pt-2 px-4'>
				<div className='relative p-[3px] rounded-xl'>
					<div
						className='absolute inset-0 rounded-lg'
						style={{
							background: 'linear-gradient(90deg, #2F51A8 0%, #122042 100%)',
						}}
					/>
					<div className='relative bg-white rounded-md p-8 text-center'>
						<div className='text-lg'>Нет данных для отображения</div>
						<div className='text-sm text-gray-500 mt-2'>Создайте первую цель, чтобы увидеть статистику</div>
					</div>
				</div>
			</section>
		)
	}

	return (
		<section className='font-bold text-lg w-full pt-2 px-4'>
			<div className='relative p-[3px] rounded-xl'>
				<div
					className='absolute inset-0 rounded-lg'
					style={{
						background: 'linear-gradient(90deg, #2F51A8 0%, #122042 100%)',
					}}
				/>
				<div className='relative bg-white grid grid-cols-1 grid-rows-2 rounded-md'>
					<div className='border-b-2 border-[#2F51A8] flex flex-col pt-2 px-2'>
						<div className='w-full flex items-center justify-between max-[380px]:flex-col mb-5'>
							<span className='text-lg font-normal text-nowrap max-[520px]:text-sm max-[440px]:text-xs'>
								Всего целей: <span className='font-bold'>{totalGoals}</span>
							</span>
							<span className='text-lg font-normal text-nowrap max-[520px]:text-sm max-[440px]:text-xs'>
								Прогресс целей | <span className='font-bold'>ТОП {Math.min(10, goalsData?.data?.filter((goal: Goal) => !goal.isCompleted).length || 0)}</span>
							</span>
						</div>
						{barChartData.length > 0 ? (
							<ResponsiveContainer height={120} className='-ml-5'>
								<BarChart height={120} data={barChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
									<defs>
										<linearGradient
											id='gradient1'
											x1='0%'
											y1='0%'
											x2='0%'
											y2='100%'
										>
											<stop offset='0%' stopColor='#2F51A8' stopOpacity={1} />
											<stop offset='100%' stopColor='#122042' stopOpacity={1} />
										</linearGradient>
									</defs>

									<XAxis dataKey='name' fontSize={12} />
									<YAxis 
										dataKey='percent' 
										fontSize={12} 
										domain={[0, 100]} 
										ticks={[0, 25, 50, 75, 100]}
										tickFormatter={(value) => `${value}%`} 
									/>
									<Bar dataKey='percent' fill='url(#gradient1)' />
								</BarChart>
							</ResponsiveContainer>
						) : (
							<div className='h-[120px] flex items-center justify-center text-gray-500'>
								Нет активных целей для отображения
							</div>
						)}
					</div>
					<div className='relative flex flex-col p-2'>
						<span className='font-normal text-sm text-nowrap'>
							Выполненные подзадачи: <span className='font-bold'>{totalCompletedSubGoals}</span>
						</span>
						<div className='w-full'>
							{lineChartData.some(item => item.subGoals > 0) ? (
								<ResponsiveContainer height={120} className='mt-4 -ml-6'>
									<LineChart height={120} data={lineChartData}>
										<XAxis dataKey='name' fontSize={10} />
										<YAxis dataKey='subGoals' fontSize={12} />
										<Line dataKey='subGoals' dot={false} stroke='#2F51A8' strokeWidth={2} />
									</LineChart>
								</ResponsiveContainer>
							) : (
								<div className='h-[120px] flex items-center justify-center text-gray-500 mt-4'>
									Нет выполненных подзадач для отображения
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
