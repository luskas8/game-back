import Games from "./in-memory/games"
import Participants from "./in-memory/participants"
import Rooms from "./in-memory/rooms"
import Places from "./static-memory/places"

interface Database {
  Participants: Participants
  Rooms: Rooms
  Places: Places
  Games: Games
}

export class InMemoryDatabase {
  private static _instance: Database

  private constructor() {
    // Private constructor, singleton
  }

  public static getIstance(): Database {
    if (!this._instance) {
      this._instance = {
        Participants: new Participants(),
        Rooms: new Rooms(),
        Places: new Places(),
        Games: new Games(),
      }
    }

    return this._instance
  }
}
