import { create } from 'zustand'

export interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}

interface TaskStore {
  tasks: Task[]
  filter: 'all' | 'active' | 'completed'
  addTask: (title: string, priority: Task['priority']) => void
  toggleTask: (id: string) => void
  removeTask: (id: string) => void
  setFilter: (filter: TaskStore['filter']) => void
  getFilteredTasks: () => Task[]
  getStats: () => { total: number; completed: number; active: number; progress: number }
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [
    { id: '1', title: '学习 React 基础', completed: true, priority: 'high' },
    { id: '2', title: '集成 shadcn/ui 组件', completed: true, priority: 'high' },
    { id: '3', title: '使用 Zustand 状态管理', completed: false, priority: 'medium' },
    { id: '4', title: '编写 MDX 博客帖子', completed: false, priority: 'medium' },
    { id: '5', title: '部署到生产环境', completed: false, priority: 'low' },
  ],
  filter: 'all',

  addTask: (title, priority) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: Date.now().toString(),
          title,
          completed: false,
          priority,
        },
      ],
    })),

  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    })),

  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  setFilter: (filter) => set({ filter }),

  getFilteredTasks: () => {
    const { tasks, filter } = get()
    switch (filter) {
      case 'active':
        return tasks.filter((t) => !t.completed)
      case 'completed':
        return tasks.filter((t) => t.completed)
      default:
        return tasks
    }
  },

  getStats: () => {
    const { tasks } = get()
    const total = tasks.length
    const completed = tasks.filter((t) => t.completed).length
    const active = total - completed
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { total, completed, active, progress }
  },
}))
