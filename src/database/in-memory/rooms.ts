import { Room } from "../../entities/Room";

export default class Rooms {
  _rooms: Room[]
  _jobIsActiveted: boolean

  constructor() {
    this._rooms = []
    this._jobIsActiveted = true

    this.clearRoomsJob()
  }

  public findById(room_id: string): Room | null {
    return this._rooms.find(r => r.id === room_id) || null
  }

  public findByIdOrAdd(room_id: string, participant_id: string): Room {
    const foundRoom = this.findById(room_id)
    if (foundRoom) return foundRoom

    const room = new Room(participant_id, room_id, room_id)
    this._rooms.push(room)
    return room
  }

  public findByName(room_name: string): Room | null {
    return this._rooms.find(r => r.name === room_name) || null
  }

  public findBySocketId(socket_id: string): Room | null {
    return this._rooms.find(r => r.participants.find(p => p.socket === socket_id)) || null
  }

  public addRoom(room: Room): Room | boolean {
    if (this.findById(room.id)) return false

    if (!this._jobIsActiveted) {
      console.log("Clearing empty rooms restart")
      this.clearRoomsJob()
    }

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

  private async clearEmptyRooms(): Promise<void> {
    new Promise<Room[]>((resolve, reject) => {
      try {
        this._rooms = this._rooms.filter(r => r.participants.length > 0)
        return resolve(this._rooms)
      } catch (err) {
        reject(this._rooms)
      }
    })
  }

  private clearRoomsJob(): void {
    const interval = setInterval(() => {
      console.log("Clearing empty rooms")
      const room_length = this._rooms.length
      this.clearEmptyRooms()

      if (room_length === this._rooms.length) {
        console.log("No empty rooms found")
        this._jobIsActiveted = false
        clearInterval(interval)
      }
    }, 60 * 100)
  }
}
