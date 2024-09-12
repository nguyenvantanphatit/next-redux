import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'

export type User = {
  id: string
  name: string
  email: string
}

interface UsersState {
  users: User[]
  currentUserId: string | null
}

const initialState: UsersState = {
  users: [],
  currentUserId: null,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.users.push({
        id: uuid(),
        name: action.payload.name,
        email: action.payload.email,
      })
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload)
    },
    setCurrentUser: (state, action: PayloadAction<string | null>) => {
      state.currentUserId = action.payload
    },
  },
})

export const { addUser, removeUser, setCurrentUser } = usersSlice.actions
export default usersSlice.reducer