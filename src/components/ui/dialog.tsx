import clsx from 'clsx'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { X } from 'lucide-react'
import {
	cloneElement,
	createContext,
	type JSX,
	type PropsWithChildren,
	useContext,
	useState
} from 'react'
import { createPortal } from 'react-dom'

export const DialogContext = createContext<{
	isOpen: boolean
	openDialog: () => void
	closeDialog: () => void
} | null>(null)

export function Dialog({
	trigger,
	children,
	title,
	className
}: PropsWithChildren<{
	trigger: JSX.Element
	title?: string
	className?: string
}>) {
	const [isOpen, setIsOpen] = useState(false)

	const openDialog = () => {
		setIsOpen(true)
		if (typeof window !== 'undefined') document.body.style.overflow = 'hidden'
	}

	const closeDialog = () => {
		setIsOpen(false)
		if (typeof window !== 'undefined') document.body.style.overflow = 'auto'
	}

	return (
		<DialogContext.Provider value={{ isOpen, closeDialog, openDialog }}>
			{cloneElement(trigger, { onClick: openDialog })}
			{createPortal(
				<DialogContent
					className={className}
					title={title}
				>
					{children}
				</DialogContent>,
				document.body
			)}
		</DialogContext.Provider>
	)
}

function DialogContent({
	children,
	className,
	title
}: PropsWithChildren<{
	className?: string
	title?: string
	side?: string
}>) {
	const DialogContextValues = useContext(DialogContext)

	if (!DialogContextValues) throw new Error('DialogContent must be used within a <Dialog />')

	const { closeDialog, isOpen } = DialogContextValues

	const sideVariants: Variants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 }
	}

	return (
		<AnimatePresence mode='wait'>
			{isOpen && (
				<div
					className='fixed left-0 top-0 w-screen h-screen overflow-hidden z-[9999]'
					id='dialog'
				>
					<motion.div
						key='dialog-overlay'
						className='absolute z-[999] bg-[rgba(0,0,0,.35)] w-screen h-screen left-0 top-0 inset-0'
						variants={sideVariants}
						onClick={closeDialog}
						initial='hidden'
						animate='visible'
						exit='hidden'
						transition={{
							duration: 0.6,
							ease: [0.6, -0.05, 0.01, 0.99]
						}}
					/>
					<motion.div
						key='dialog-content'
						id='dialog-content'
						className={clsx(
							'overflow-y-scroll scroll-smooth no-scrollbar fixed top-1/5 left-1/2 -translate-x-1/2 p-4 bg-white z-[1000] w-1/2 max-sm:w-[90vw] max-h-[75vh] h-auto rounded-lg'
						)}
						variants={sideVariants}
						initial='hidden'
						animate='visible'
						exit='hidden'
					>
						<div className='w-full flex justify-between items-center mb-6'>
							<h2 className='text-xl font-bold text-black max-[450px]:text-xl'>{title}</h2>
							<X
								className='cursor-pointer'
								onClick={closeDialog}
								size={24}
								color='#000'
							/>
						</div>
						<div className={clsx('w-full h-full', className)}>{children}</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	)
}
