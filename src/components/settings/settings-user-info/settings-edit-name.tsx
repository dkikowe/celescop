import { useNavigate } from 'react-router'
import { useEditUser } from '../../../hooks/useEditUser'
import { useAuthStore } from '../../../store/auth.store'
import { Button } from '../../ui/button'
import { DialogContext } from '../../ui/dialog'
import { useForm } from 'react-hook-form'
import { useContext, useEffect } from 'react'

export function SettingsEditName() {
	const DialogContextValues = useContext(DialogContext)
	const closeDialog = () => DialogContextValues?.closeDialog()

	const { user } = useAuthStore()
	const navigate = useNavigate()
	const { register, handleSubmit } = useForm<{
		firstName?: string
		lastName?: string
	}>()
	const { mutate: editUser, isPending } = useEditUser(closeDialog)

	useEffect(() => {
		if (!user) navigate('/register')
	}, [user])

	return (
		<form
			action='#'
			className='w-full flex flex-col gap-4'
			onSubmit={handleSubmit(data => editUser({ id: user!.id, data }))}
		>
			<div>
				<label htmlFor='first-name' className='mb-2 opacity-80 font-medium'>
					Новое имя
				</label>
				<input
					className='border rounded-lg p-2 border-[#00000020] w-full'
					type='text'
					placeholder='Имя'
					id='first-name'
					defaultValue={user?.firstName}
					{...register('firstName')}
				/>
			</div>
			<div>
				<label htmlFor='first-name' className='mb-2 opacity-80 font-medium'>
					Новая фамилия
				</label>
				<input
					className='border rounded-lg p-2 border-[#00000020] w-full'
					type='text'
					placeholder='Фамилия'
					id='last-name'
					defaultValue={user?.lastName}
					{...register('lastName')}
				/>
			</div>
			<Button disabled={isPending} className='w-2/3 mx-auto'>
				Сменить
			</Button>
		</form>
	)
}
