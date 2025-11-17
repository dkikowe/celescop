import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { Block } from '../ui/block'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'

export function CreateGoalImageField({
	setValue,
	watch,
}: {
	setValue: UseFormSetValue<any>
	watch: UseFormWatch<any>
}) {
	const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
	
	// Получаем текущую цель из формы
	const goal = watch('currentGoal')
	
	// Устанавливаем URL текущей фотографии при загрузке компонента
	useEffect(() => {
		if (goal?.imageUrl) {
			setCurrentImageUrl(goal.imageUrl)
		}
	}, [goal])
	
	return (
		<Block title='Загрузить фото (необязательно)'>
			<div className='w-full px-4'>
				{currentImageUrl && (
					<div className="mb-4">
						<p className="text-sm font-medium mb-2">Текущее фото:</p>
						<img 
							src={currentImageUrl} 
							alt="Текущее фото цели" 
							className="max-w-full h-auto max-h-40 object-contain border border-gray-200 rounded-md"
						/>
					</div>
				)}
			<Button
				type='button'
				onClick={() => document.getElementById('image')?.click()}
			>
				{currentImageUrl ? 'Изменить фото' : 'Загрузить'}
			</Button>
			<input
				type='file'
				id='image'
				className='hidden'
				accept='image/*,.png,.jpg,.jpeg,.heic'
				onChange={e => {
					const file = e.target.files?.[0]
					if (file) {
						console.log('Goal image selected:', file.name, 'size:', file.size, 'type:', file.type)
					}
					setValue('image', file)
					// Очищаем URL текущей фотографии при выборе нового файла
					setCurrentImageUrl(null)
				}}
			/>
			{watch('image') && <p className='mt-2'>{watch('image')?.name}</p>}
			</div>
		</Block>
	)
}
