interface Props {
	photoUrl: string | undefined
	firstName: string | undefined
	lastName: string | undefined
}

export function LoginUserInfo({ firstName, lastName, photoUrl }: Props) {
	return (
		<div className='py-8 px-4 flex items-center gap-5 max-[330px]:gap-3'>
			<img
				className='w-[100px] h-[100px] aspect-square rounded-full'
				src={photoUrl}
			/>
			<div className='flex flex-col'>
				<h2 className='font-bold text-xl'>
					{lastName} {firstName}
				</h2>
			</div>
		</div>
	)
}
