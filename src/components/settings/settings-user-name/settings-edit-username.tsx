import { useNavigate } from 'react-router'
import { useEditUser } from '../../../hooks/useEditUser'
import { useAuthStore } from '../../../store/auth.store'
import { Button } from '../../ui/button'
import { DialogContext } from '../../ui/dialog'
import { useForm } from 'react-hook-form'
import { useContext, useEffect } from 'react'

export function SettingsEditUsername() {
	const { user } = useAuthStore()

	const DialogContextValues = useContext(DialogContext)
	const closeDialog = () => DialogContextValues?.closeDialog()

	const navigate = useNavigate()
	const { register, handleSubmit } = useForm<{
		username?: string
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
					Новый логин
				</label>
				<input
					className='border rounded-lg p-2 border-[#00000020] w-full'
					type='text'
					placeholder='Имя'
					id='first-name'
					defaultValue={user!.username}
					{...register('username')}
				/>
			</div>
			<Button disabled={isPending} className='w-2/3 mx-auto'>
				Сменить
			</Button>
		</form>
	)
}
