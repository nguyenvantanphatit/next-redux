import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'

export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type Task = {
  id: string
  title: string
  description?: string
  status: Status
}

interface TasksState {
  tasks: Task[]
  draggedTask: string | null
}

const initialState: TasksState = {
  tasks: [],
  draggedTask: null,
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<{ title: string; description?: string }>) => {
      state.tasks.push({
        id: uuid(),
        title: action.payload.title,
        description: action.payload.description,
        status: 'TODO',
      })
    },
    dragTask: (state, action: PayloadAction<string>) => {
      state.draggedTask = action.payload
    },
    updateTask: (state, action: PayloadAction<{ id: string; status: Status }>) => {
      const task = state.tasks.find(task => task.id === action.payload.id)
      if (task) {
        task.status = action.payload.status
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
    },
    reorderTask: (state, action: PayloadAction<{ draggedId: string, droppedId: string | null }>) => {
      const { draggedId, droppedId } = action.payload
      const doneTasks = state.tasks.filter(task => task.status === 'DONE')
      const draggedTaskIndex = doneTasks.findIndex(task => task.id === draggedId)
      
      if (draggedTaskIndex !== -1) {
        const [draggedTask] = doneTasks.splice(draggedTaskIndex, 1)
        
        if (droppedId === null) {
          // If dropped at the end
          doneTasks.push(draggedTask)
        } else {
          const droppedTaskIndex = doneTasks.findIndex(task => task.id === droppedId)
          doneTasks.splice(droppedTaskIndex, 0, draggedTask)
        }
        
        // Update the main tasks array
        state.tasks = [
          ...state.tasks.filter(task => task.status !== 'DONE'),
          ...doneTasks
        ]
      }
    },
  },
})

export const { addTask, dragTask, updateTask, removeTask, reorderTask } = tasksSlice.actions
export default tasksSlice.reducer