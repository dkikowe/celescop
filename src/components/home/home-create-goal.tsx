import { Link } from 'react-router'
import { Button } from '../ui/button'

export function HomeCreateGoal({className}: {className?: string}) {
	return (
		<Link to='/create-goal' className={className}>
			<Button>+</Button>
		</Link>
	)
}
