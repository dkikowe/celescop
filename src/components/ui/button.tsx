import * as React from 'react'
import clsx from 'clsx'

function Button({ className, ...props }: React.ComponentProps<'button'> & {}) {
	return (
		<button
			style={{
				background: 'linear-gradient(90deg, #27448D 0%, #0B1327 100%)',
			}}
			data-slot='button'
			className={clsx(
				"inline-flex cursor-pointer px-10 py-2 items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-white font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none",
				className
			)}
			{...props}
		/>
	)
}

export { Button }
