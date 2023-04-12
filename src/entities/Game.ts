import { Character } from "./Character"
import { v4 as uuid } from "uuid"

export class Game {
  private _id: string
  private _room_id: string
  private _currentRound: number
  private _gameRounds: number
  private _fisrtPlayerIdWasKiller: string
  private _currentPlayerKillerId: string
  private _players: Character[]

  constructor(room_id: string) {
    this._id = uuid()
    this._room_id = room_id
  }

  get id(): string {
    return this._id
  }

  public playerById(participant_id: string): Character | null {
    return this._players.find(p => p.participant_id === participant_id) || null
  }

  get room_id(): string {
    return this._room_id
  }

  public start(fisrtPlayerIdWasKiller: string): void {
    this._fisrtPlayerIdWasKiller = fisrtPlayerIdWasKiller
    this._currentPlayerKillerId = fisrtPlayerIdWasKiller
    this._currentRound = 1
    this._gameRounds = 1

    console.log("Game started")
  }

  public end(): void {
    console.log("Game ended")
  }

  public endRound(): void {
    this._currentRound += 1
    this.startNewRound()

    if (this._currentRound <= 3) {
      return
    }

    this._gameRounds += 1
    return
  }

  public startNewRound(): void {
    const currentKillerPlayersIndex = this._players.findIndex(p => p.participant_id === this._currentPlayerKillerId)
    const nextKillerPlayerIndex = (currentKillerPlayersIndex + 1) % this._players.length
    const nextKillerPlayerId = this._players[nextKillerPlayerIndex].participant_id

    if (nextKillerPlayerId === this._fisrtPlayerIdWasKiller) {
      this.end()
      return
    }

    this._currentPlayerKillerId = nextKillerPlayerId

    this._players.forEach(p => {
      if (p.participant_id === this._currentPlayerKillerId) return

      p.restartPlaces()
    })

    console.log("New round started")
  }

  public participantMove(participant_id: string, place_id: string): string {
    if (participant_id === this._currentPlayerKillerId) {
      return "You are the killer"
    }

    const player = this._players.find(p => p.participant_id === participant_id)
    if (!player) {
      return "You are not in this game"
    }

    if (!player.choosePlace(place_id)) {
      return "You already choose this place"
    }
  }
}
