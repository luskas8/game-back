import Participants from "./in-memory/participants"
import Rooms from "./in-memory/rooms"

interface Database {
  Participants: Participants
  Rooms: Rooms
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
        Rooms: new Rooms()
      }
    }

    return this._instance
  }
}
