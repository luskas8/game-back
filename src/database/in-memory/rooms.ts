import { Room } from "../../entities/Room";

export default class Rooms {
  _rooms: Room[]

  constructor() {
    this._rooms = []
  }

  public findById(room_id: string): Room | null {
    return this._rooms.find(r => r.id === room_id) || null
  }

  public findByName(room_name: string): Room | null {
    return this._rooms.find(r => r.name === room_name) || null
  }

  public findBySocketId(socket_id: string): Room | null {
    return this._rooms.find(r => r.participants.find(p => p.socket === socket_id)) || null
  }

  public addRoom(room: Room): Room | boolean {
    if (this.findById(room.id)) return false

    this._rooms.push(room)
    return room
  }

  public removeRoom(room: Room): Room | boolean {
    if (!this.findById(room.id)) return false

    this._rooms = this._rooms.filter(r => r.id !== room.id)
    return room
  }

  get rooms(): { id: string, name: string, partcipants: { id: string, socket: string }[] }[]  {
    return this._rooms.map(r => {
      return {
        id: r.id,
        name: r.name,
        partcipants: r.participants
      }
    })
  }
}
