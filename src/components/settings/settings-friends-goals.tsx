import { ChevronDownIcon } from 'lucide-react'
import { useGetFriends, useGetFriendsGoals } from '../../hooks/useFriends'
import { SubGoal } from '../../types/goal'
import { useAuthStore } from '../../store/auth.store'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'

const SUBGOAL_PROGRESS_COLORS = {
	COMPLETED: '#51AE1C',
	IN_PROGRESS: '#F9F924',
	NOT_STARTED: '#727473',
}

export function SettingsFriendsGoals() {
	const { user } = useAuthStore()
	const { data: friends } = useGetFriends()
	const { data: friendsGoals } = useGetFriendsGoals()
	console.log(friendsGoals)

	return (
		<>
			<div className='px-4 flex items-center justify-center gap-3 mt-5'>
				<p className='text-sm text-start'>Ссылка для приглашения друзей</p>
				<Button
					className='w-min !py-1 !px-4 !text-sm rounded-md'
					onClick={() => {
						navigator.clipboard.writeText(
							`https://t.me/celiscope_bot/celiscope?startapp=${user?.inviteCode}`
						)
						toast.success('Скопировано!')
					}}
				>
					Скопировать
				</Button>
			</div>
			<details className='mt-5' open>
				<summary
					className='text-white h-min p-0.5 text-center appearance-none bg-[#27448D]'
					style={{
						background: 'linear-gradient(90deg, #27448D 0%, #0B1327 100%)',
					}}
				>
					Цели друзей
				</summary>
				<div className='flex flex-col px-4 gap-6 mt-6'>
					{friends?.map(friend => {
						const friendGoals = friendsGoals?.filter(
							goal => goal.userId === friend.id
						)?.sort((a: any, b: any) => {
							// Сначала сортируем по статусу выполнения
							if (a.isCompleted && !b.isCompleted) return 1
							if (!a.isCompleted && b.isCompleted) return -1
							// Затем сортируем по дате создания (новые сверху)
							return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
						})

						return (
							<details key={friend.id}>
								<summary
									className='text-white px-8 h-min flex items-center justify-between py-2 rounded-md text-center bg-[#27448D]'
									style={{
										background:
											'linear-gradient(90deg, #27448D 0%, #0B1327 100%)',
									}}
								>
									<div className='flex items-center gap-4'>
										<img
											src={friend.photoUrl}
											className='w-14 h-14 rounded-full'
											alt={friend.firstName}
										/>
										<div className='flex flex-col text-start'>
											<h3 className='font-medium text-lg'>
												{friend.firstName} {friend.lastName}
											</h3>
											<span className='text-xs'>{friend.username}</span>
										</div>
									</div>
									<div>
										<ChevronDownIcon size={26} />
									</div>
								</summary>
								<div className='bg-white border-2 border-[#27448D] rounded-b-md p-4 flex items-center flex-col gap-2.5'>
									{friendGoals ? (
										friendGoals?.map((friendGoal: any, index: number) => {
											const subGoals = friendGoal.subGoals
											const completedSubGoals = subGoals?.filter(
												(subGoal: SubGoal) => subGoal.isCompleted
											)
											const percent =
												completedSubGoals.length === 0 && subGoals.length === 0
													? 100
													: Number(((completedSubGoals.length / subGoals.length) * 100).toFixed(2)) || 0

											const status =
												percent === 100
													? 'COMPLETED'
													: percent > 0
													? 'IN_PROGRESS'
													: 'NOT_STARTED'

											return (
												<div
													key={friendGoal.id}
													className='grid grid-cols-[1.3fr_1fr_1fr] w-full'
												>
													<h4
														className='font-medium text-sm'
														style={{ wordBreak: 'break-word' }}
													>
														{index + 1}. {friendGoal.title}
													</h4>
													<span className='text-sm'>
														<span className='max-[340px]:!hidden'>Задачи</span>{' '}
														{completedSubGoals.length} / {subGoals.length}
													</span>
													<div
														className='w-32 h-6 max-[420px]:!w-18 flex items-center justify-center font-medium'
														style={{
															backgroundColor: SUBGOAL_PROGRESS_COLORS[status],
														}}
													>
														{percent} %
													</div>
													<img src={friendGoal.imageUrl} alt="" />
												</div>
											)
										})
									) : (
										<span className='font-medium text-center'>
											У {friend.firstName} еще нет целей!
										</span>
									)}
								</div>
							</details>
						)
					})}
				</div>
			</details>
		</>
	)
}
