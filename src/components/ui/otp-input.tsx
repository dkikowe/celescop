import { useState, useRef } from 'react'

interface OTPInputProps {
	length?: number
	onComplete: (otp: string) => void
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 4, onComplete }) => {
	const [otp, setOtp] = useState<string[]>(new Array(length).fill(''))
	const inputsRef = useRef<(HTMLInputElement | null)[]>([])

	const handleChange = (index: number, value: string) => {
		if (!/^\d?$/.test(value)) return
		const newOtp = [...otp]
		newOtp[index] = value
		setOtp(newOtp)

		onComplete(newOtp.join(''))

		if (value && index < length - 1) {
			inputsRef.current[index + 1]?.focus()
		}
	}

	const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			inputsRef.current[index - 1]?.focus()
		}
	}

	return (
		<div className='flex gap-2'>
			{otp.map((digit, index) => (
				<div key={index} className='relative'>
					<input
						ref={el => {
							inputsRef.current[index] = el
						}}
						type='number'
						value={digit}
						maxLength={1}
						pattern='[0-9]*'
						inputMode='numeric'
						onChange={e => handleChange(index, e.target.value)}
						onKeyDown={e => handleKeyDown(index, e)}
						className='w-10 h-10 text-center text-xl font-medium outline-none appearance-none'
					/>
					<div
						className='absolute bottom-0 left-0 right-0'
						style={{
							height: '2px',
							background: 'linear-gradient(90deg, #2F51A8 0%, #122042 100%)',
						}}
					/>
				</div>
			))}
		</div>
	)
}

export default OTPInput
