import { Socket } from "socket.io"
import { v4 as uuid } from "uuid"

export class Participant {
  private _id: string
  private _socket: Socket

  constructor(id?: string, socket?: Socket) {
    this._id = id || uuid()
    this._socket = socket || null
  }

  get id(): string {
    return this._id
  }

  get socket(): Socket {
    return this._socket
  }

  set socket(socket: Socket) {
    this._socket = socket
  }
}
