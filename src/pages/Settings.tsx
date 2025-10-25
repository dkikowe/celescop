// import { useGetSettings } from '../hooks/useGetSettings'
// import { CustomNotifies } from '../components/settings/customNotifies'
// import { LoaderIcon } from 'lucide-react'

// export function Settings() {
// 	const { data: settings, isLoading } = useGetSettings()

// 	if (isLoading) {
// 		return (
// 			<div className='flex justify-center items-center h-screen'>
// 				<LoaderIcon className='animate-spin' />
// 			</div>
// 		)
// 	}

// 	return (
// 		<div className='flex flex-col gap-4 p-4'>
// 			<CustomNotifies settings={settings} />
// 		</div>
// 	)
// } 