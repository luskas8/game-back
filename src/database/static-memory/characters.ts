export type CharacterType = {
  name: string
  favoritePlaceId: string
}

export default class Characters {
  private _characters: CharacterType[] = [
    { name: "Talyta", favoritePlaceId: "32423" },
    { name: "Gordão", favoritePlaceId: "54353" },
    { name: "Zé", favoritePlaceId: "all" },
    { name: "Jaiminho", favoritePlaceId: "54254" },
    { name: "Lari", favoritePlaceId: "51435" },
    { name: "Fer", favoritePlaceId: "32131" },
  ]

  get characters(): CharacterType[] {
    return this._characters
  }
}
