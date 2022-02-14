export type ErrorDto = {
  message: string
}

export type MessageData<T = unknown> = {
  message: string
  data: T
}
