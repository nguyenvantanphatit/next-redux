'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/lib/store'
import { updateTask, Status, reorderTask } from '@/lib/slices/tasksSlice'
import Task from './task'
import { useMemo } from 'react'

export default function Column({
  title,
  status
}: {
  title: string
  status: Status
}) {
  const dispatch = useDispatch<AppDispatch>()
  const tasks = useSelector((state: RootState) => state.tasks.tasks)

  const filteredTasks = useMemo(
    () => tasks.filter(task => task.status === status),
    [tasks, status]
  )

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const data = JSON.parse(e.dataTransfer.getData('text/plain'))
    const draggedTask = tasks.find(task => task.id === data.id)
    
    if (draggedTask && draggedTask.status !== status) {
      dispatch(updateTask({ id: data.id, status }))
    } else if (status === 'DONE' && e.target === e.currentTarget) {
      // If dropped on the column itself (not on another task), move to the end
      dispatch(reorderTask({ draggedId: data.id, droppedId: null }))
    }
  }

  return (
    <section className='h-[600px] flex-1'>
      <h2 className='ml-1 font-serif text-2xl font-semibold'>{title}</h2>

      <div
        className='mt-3.5 h-full w-full rounded-xl bg-gray-700/50 p-4'
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className='flex flex-col gap-4'>
          {filteredTasks.map((task, index) => (
            <Task key={task.id} {...task} index={index} />
          ))}

          {filteredTasks.length === 0 && status === 'TODO' && (
            <div className='mt-8 text-center text-sm text-gray-500'>
              <p>Create a new task</p>
            </div>
          )}

          {tasks.length > 0 && filteredTasks.length === 0 && status !== 'TODO' && (
            <div className='mt-8 text-center text-sm text-gray-500'>
              <p>Drag your tasks here</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
