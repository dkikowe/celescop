import clsx from 'clsx'
import { FC } from 'react'

interface SwitchProps {
	checked: boolean
	onChange: (checked: boolean) => void
	className?: string
}

const Switch: FC<SwitchProps> = ({ checked, onChange, className }) => {
	return (
		<label className='relative inline-flex items-center cursor-pointer'>
			<input
				type='checkbox'
				checked={checked}
				onChange={e => onChange(e.target.checked)}
				className='sr-only peer'
			/>
			<div
				className={clsx(
					'w-7 h-3 bg-gray-300 peer-checked:bg-[#B3C1FE] rounded-full overflow-visible transition-colors relative',
					className
				)}
			>
				<div
					className={clsx(
						'absolute w-4 h-4 top-1/2 -translate-y-1/2 bg-[#27448D] rounded-full transition-all',
						{
							'translate-x-3': checked,
							'translate-x-0 bg-gray-500': !checked,
						}
					)}
				/>
			</div>
		</label>
	)
}

export default Switch
