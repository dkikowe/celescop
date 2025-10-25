export interface Goal {
	id: number
	title: string
	description: string
	urgencyLevel: 'low' | 'average' | 'high'
	deadline: Date
	subGoals?: SubGoal[]
	completedAt: Date
	isCompleted: boolean
	imageUrl: string
	createdAt: Date
	award?: string
}

export interface SubGoal {
	id: number
	description: string
	deadline: Date
	isCompleted: boolean
	completedAt: Date
	goalId: number
}
