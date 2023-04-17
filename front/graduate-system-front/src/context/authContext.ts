// @types.todo.ts
export interface User {
  email: number
}
export type AuthContextType = {
  user: User,
  setUser: Function
}
