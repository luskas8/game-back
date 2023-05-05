import { Socket } from "socket.io"
import { Participant } from "../../entities/Participant"

export default class Participants {
  private _participants: Participant[]

  constructor() {
    this._participants =[]
  }

  public find(participant_id: string): Participant | null {
    return this._participants.find(p => p.id === participant_id) || null
  }

  public add(participant: Participant): Participant | boolean {
    if (this.find(participant.id)) return false

    this._participants.push(participant)
    return participant
  }

  public upsert(participant_id: string, socket: Socket = null): Participant {
    if (participant_id) {
      const foundParticipant = this.find(participant_id)
      if (foundParticipant) {
        foundParticipant.socket = socket
        return foundParticipant
      }
    }

    const participant = new Participant(participant_id, socket)
    this._participants.push(participant)
    return participant
  }

  public remove(participant: Participant): Participant | boolean {
    if (!this.find(participant.id)) return false

    this._participants = this._participants.filter(p => p.id !== participant.id)
    return participant
  }

  public removeBySocket(socket_id: string): Participant | boolean {
    const participant = this._participants.find(p => p.socket.id === socket_id)
    if (!participant) return false

    this._participants = this._participants.filter(p => p.id !== participant.id)
    return participant
  }

  public update(participant: Participant): boolean {
    this._participants.map(p => {
      if (p.id === participant.id) {
        p = participant
      }
      return p
    })
    return true
  }

  get participants(): { id: string, socket: string }[] {
    return this._participants.map(p => {
      return {
        id: p.id,
        socket: p.socket.id
      }
    })
  }
}
