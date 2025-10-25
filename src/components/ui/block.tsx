import clsx from 'clsx'
import { JSX, PropsWithChildren } from 'react'
import Popup from 'reactjs-popup'

export function Block({
	title,
	titleSize,
	children,
	popup,
}: PropsWithChildren<{
	title: string
	titleSize?: number
	popup?: JSX.Element
}>) {
	return (
		<div className='w-full'>
			{popup ? (
				<Popup
					arrow={false}
					position='bottom center'
					contentStyle={{
						width: '80%',
						marginTop: '10px',
						marginInline: 'auto',
						textAlign: 'center',
						color: 'white',
						border: 'none',
						background: 'linear-gradient(90deg, #27448D 39.5%, #0B1327 100%)',
						padding: '10px',
						fontSize: '18px',
						fontWeight: '600',
						boxShadow: '0px 40px 30px 20px #00000040',
					}}
					trigger={
						<div
							className={clsx(
								'rounded-t-lg relative text-white py-0.5 px-1 font-semibold text-center',
								{
									'pb-5': popup,
								}
							)}
							style={{
								background: 'linear-gradient(90deg, #2F51A8 0%, #122042 100%)',
								fontSize: titleSize,
							}}
						>
							{title}
							{popup && <span className='absolute right-2 bottom-0'>?</span>}
						</div>
					}
				>
					{popup}
				</Popup>
			) : (
				<div
					className='rounded-t-lg text-white py-0.5 px-1 font-semibold text-center'
					style={{
						background: 'linear-gradient(90deg, #2F51A8 0%, #122042 100%)',
						fontSize: titleSize,
					}}
				>
					{title}
				</div>
			)}

			<div className='relative p-[3px] rounded-xl'>
				<div
					className='absolute inset-0 rounded-b-lg'
					style={{
						background: 'linear-gradient(90deg, #2F51A8 0%, #122042 100%)',
					}}
				/>

				<div className='relative bg-white flex items-center justify-center rounded-b-md py-4'>
					{children}
				</div>
			</div>
		</div>
	)
}
