export type Place = {
  id: string
  description: string
}

export default class Places {
  private _places: Place[] = [
    { id: "51435", description: "kiss"},
    { id: "32131", description: "lake"},
    { id: "54353", description: "food"},
    { id: "32423", description: "meditate"},
    { id: "54254", description: "campfire"},
  ]

  get places(): Place[] {
    return this._places
  }
}
