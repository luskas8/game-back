import { InMemoryDatabase } from "../database"
import { Place } from "../database/static-memory/places"

interface CharacterPlaces extends Place {
  selected: boolean
  current: boolean
}

export class Character {
  private _participant_id: string
  public name: string
  public favoritePlaceId: string
  public currentPlaceId: string | null
  private selectedPlaces: Place[] | null

  constructor(participant_id: string,name: string, favoritePlaceId: string) {
    this._participant_id = participant_id
    this.name = name
    this.favoritePlaceId = favoritePlaceId
    this.selectedPlaces = []
  }

  public restartPlaces(): void {
    this.selectedPlaces = []
    this.currentPlaceId = null
  }

  public get participant_id(): string {
    return this._participant_id
  }

  public choosePlace(placeId: string): boolean {
    if (!this.selectedPlaces.find(p => p.id === placeId)) {
      const database = InMemoryDatabase.getIstance()
      this.selectedPlaces.push(database.Places.places.find(p => p.id === placeId))
      this.currentPlaceId = placeId
      return true
    }

    return false
  }

  public characterPlaces(): CharacterPlaces[] {
    const database = InMemoryDatabase.getIstance()
    const places = database.Places.places
    return places.map(p => {
      return {
        ...p,
        selected: !!this.selectedPlaces.find(sp => sp.id === p.id),
        current: this.currentPlaceId === p.id
      }
    })
  }
}
