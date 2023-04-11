import { v4 as uuid,  } from "uuid"
import { Participant } from "./Participant"

export class Room {
  private _id: string
  private _name: string
  private owner: string
  private _participants: Participant[]

  constructor(room_name: string, owner: string, id?: string) {
    this._id = id || uuid()
    this._name = room_name
    this.owner = owner
    this._participants = []
  }

  public addParticipant(participant: Participant): Participant | boolean {
    if (this._participants.find(p => p.id === participant.id)) return false

    this._participants.push(participant)
    return participant
  }

  public removeParticipant(participant: Participant): Participant | boolean {
    if (!this._participants.find(p => p.id === participant.id)) return false

    this._participants = this._participants.filter(p => p.id !== participant.id)
    return participant
  }

  public removeParticipantBySocket(socket_id: string): Participant | boolean {
    const participant = this._participants.find(p => p.socket.id === socket_id)
    if (!participant) return false

    this._participants = this._participants.filter(p => p.socket.id !== socket_id)
    return participant
  }

  get id(): string {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get participants(): { id: string, socket: string  }[] {
    return this._participants.map(p => {
      return {
        id: p.id,
        socket: p.socket.id
      }
    })
  }
}
