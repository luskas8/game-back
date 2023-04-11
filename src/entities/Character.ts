export class Character {
  public name: string
  public place: string
  private selectedPlaces = []

  constructor(name: string, place: string) {
    this.name = name
    this.place = place
    this.selectedPlaces = []
  }

  public choosePlace(place: string): boolean {
    if (!this.selectedPlaces.includes(place)) {
      this.selectedPlaces.push(place)
      return true
    }

    return false
  }
}
