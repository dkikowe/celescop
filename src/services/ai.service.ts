import { api } from '@/lib/axios'

export interface GenerateGoalDescriptionDto {
  title: string
  context?: string
}

export interface GenerateTasksDto {
  title: string
  context?: string
  maxItems?: number
  // Доп. подсказка: общий срок выполнения цели (ENUM из формы)
  deadline?: string
}

export interface GenerateMotivationDto {
  completed: number
  total: number
}

export interface GenerateWeeklyReportDto {
  userName: string
  goalsSummary: Array<{
    title: string
    completed: number
    total: number
    highlights?: string[]
  }>
}

export interface ChatAboutGoalsDto {
  question: string
  focus?: string
  context?: {
    goals?: Array<{
      title: string
      progress?: { completed: number; total: number }
      description?: string
      subGoals?: Array<{ description: string; done?: boolean }>
    }>
  }
  history?: Array<{ role: 'user' | 'assistant'; content: string }>
}

export interface GenerateGoalFromTemplateDto {
  template: 'Похудеть' | 'Заработать' | 'Купить ценную вещь' | 'Путешествие' | 'Изучить что то новое'
  deadline?: string
  shortDescription?: string
}

export interface GenerateGoalFromTemplateResponse {
  title?: string
  description: string
  tasks: Array<string | { description: string; deadline?: string | Date }>
}

class AIService {
  async generateGoalDescription(dto: GenerateGoalDescriptionDto): Promise<string> {
    console.log('[AI] POST /ai/goal/description -> payload:', dto)
    const { data } = await api.post<{ text: string }>(`/ai/goal/description`, dto)
    return data.text
  }

  async generateTasks(dto: GenerateTasksDto): Promise<Array<string | { description: string; deadline?: string | Date }>> {
    console.log('[AI] POST /ai/goal/tasks -> payload:', dto)
    const { data } = await api.post<{ tasks: Array<string | { description: string; deadline?: string | Date }> }>(`/ai/goal/tasks`, dto)
    return data.tasks
  }

  async generateMotivation(dto: GenerateMotivationDto): Promise<string> {
    console.log('[AI] POST /ai/goal/motivation -> payload:', dto)
    const { data } = await api.post<{ text: string }>(`/ai/goal/motivation`, dto)
    return data.text
  }

  async generateWeeklyReport(dto: GenerateWeeklyReportDto): Promise<string> {
    const { data } = await api.post<{ text: string }>(`/ai/goal/weekly-report`, dto)
    return data.text
  }

  async getWeeklyReport(): Promise<any> {
    console.log('[AI] GET /ai/goal/weekly-report')
    const { data } = await api.get(`/ai/goal/weekly-report`)
    console.log('[AI] /ai/goal/weekly-report <- response:', data)
    return data
  }

  async generateTemplates(): Promise<string[]> {
    console.log('[AI] GET /ai/goal/templates')
    const { data } = await api.get<{ templates: string[] }>(`/ai/goal/templates`)
    return data.templates
  }

  async triggerMessage(payload:
    | { type: 'HALF_DONE'; totalTasks: number; completedTasks: number }
    | { type: 'TASK_OVERDUE'; goalTitle: string; taskTitle: string }
    | { type: 'FIRST_TASK_DONE'; goalTitle: string }
    | { type: 'GOAL_OVERDUE'; goalTitle: string }
    | { type: 'GOAL_COMPLETED'; goalTitle: string }
  ): Promise<string> {
    console.log('[AI] POST /ai/goal/trigger-message -> payload:', payload)
    const { data } = await api.post<{ text: string }>(`/ai/goal/trigger-message`, payload)
    console.log('[AI] /ai/goal/trigger-message <- response:', data)
    return data.text
  }

  async chatAboutGoals(dto: ChatAboutGoalsDto): Promise<string> {
    console.log('[AI] POST /ai/goal/chat -> payload:', dto)
    const { data } = await api.post<{ text: string }>(`/ai/goal/chat`, dto)
    return data.text
  }

  async generateGoalFromTemplate(dto: GenerateGoalFromTemplateDto): Promise<GenerateGoalFromTemplateResponse> {
    console.log('[AI] POST /ai/goal/from-template -> payload:', dto)
    const { data } = await api.post<GenerateGoalFromTemplateResponse>(`/ai/goal/from-template`, dto)
    return data
  }
}

export const aiService = new AIService()


