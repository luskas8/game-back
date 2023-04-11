export type HttpStatusCode = 200 | 201 | 400 | 404 | 500

export interface BaseResponse {
  status: StatusCode
  message: string
}
