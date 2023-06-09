import { Router } from "express"
import { BaseResponse } from "../../@types/response"
import { InMemoryDatabase } from "../../database"
import { Participant } from "../../entities/Participant"
import { Room } from "../../entities/Room"

const router = Router()

router.get("/", (req, res) => {
  res.status(200).send({ status: 200, message: "ok" } as BaseResponse)
})

router.get("/test", (req, res) => {
  res.status(200).sendFile("index.html", { root: "./public" })
})

router.post('/room', (req, res) => {
  const { room_name } = req.body
  const database = InMemoryDatabase.getIstance()

  if (!room_name || room_name.length < 3) {
    return res.status(400).json({
      message: "Invalid request."
    })
  }

  const participant = new Participant()
  database.Participants.add(participant)

  const room = database.Rooms.addRoom(new Room(participant.id, room_name))
  if (typeof room === "boolean") {
    database.Participants.remove(participant)

    return res.status(400).json({
      message: "Room already exists."
    })
  }

  room.addParticipant(participant)

  return res.status(201).json({
    message: "Room created.",
    room: {
      id: room.id,
      name: room.name,
      owner: participant.id
    },
    participant: {
      id: participant.id
    }
  })
})

router.get('/data', (req, res) => {
  const database = InMemoryDatabase.getIstance()
  res.status(200).send({
    rooms: database.Rooms.rooms,
    participants: database.Participants.participants,
    games: database.Games.games,
  })
})

router.get('/places', (req, res) => {
  const database = InMemoryDatabase.getIstance()
  res.status(200).send({
    places: database.Places.places
  })
})

router.get('/characters', (req, res) => {
  const database = InMemoryDatabase.getIstance()
  res.status(200).send({
    characters: database.Characters.characters
  })
})

router.get('/characters/:room_id', (req, res) => {
  const { room_id } = req.params

  const database = InMemoryDatabase.getIstance()
  res.status(200).send({
    characters: database.Games.findByRoomId(room_id)?.availableCharacters() || []
  })
})

router.get('/game/:game_id/places/:participant_id', (req, res) => {
  const { game_id, participant_id } = req.params

  if (!game_id || !participant_id) {
    return res.status(400).json({
      message: "Invalid request."
    })
  }
  const database = InMemoryDatabase.getIstance()

  const game = database.Games.findById(game_id)

  if (!game) {
    return res.status(400).json({
      message: "Invalid game."
    })
  }

  const player = game.playerById(participant_id)

  if (!player) {
    return res.status(400).json({
      message: "Invalid participant."
    })
  }

  res.status(200).json({
    places: player.characterPlaces
  })
})

export default router
