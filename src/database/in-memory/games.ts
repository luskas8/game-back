import { Game } from "../../entities/Game";

export default class Games {
  private _games: Game[]

  constructor() {
    this._games = []
  }

  get games(): Game[] {
    return this._games
  }

  public findById(game_id: string): Game | null {
    return this._games.find(g => g.id === game_id) || null
  }

  public addGame(game: Game): Game | boolean {
    if (this.findById(game.id)) return false

    this._games.push(game)
    return game
  }

  public removeGame(game: Game): Game | boolean {
    if (!this.findById(game.id)) return false

    this._games = this._games.filter(g => g.id !== game.id)
    return game
  }

  public findByRoomId(room_id: string): Game | null {
    return this._games.find(g => g.room_id === room_id) || null
  }

  public findByRoomIdOrAdd(room_id: string): Game | null {
    const foundGame = this.findByRoomId(room_id)
    if (foundGame) return foundGame

    const game = new Game(room_id)
    this._games.push(game)
    return game
  }

  public removeById(game_id: string): Game | boolean {
    const game = this.findById(game_id)
    if (!game) return false

    this._games = this._games.filter(g => g.id !== game_id)
    return game
  }

}
