import { Router } from "express"
import { BaseResponse } from "../@types/response"
import { InMemoryDatabase } from "../database"
import { Participant } from "../entities/Participant"
import { Room } from "../entities/Room"

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

  const room = new Room(room_name, participant.id)
  if (!database.Rooms.addRoom(room)) {
    database.Participants.remove(participant)

    return res.status(400).json({
      message: "Room already exists."
    })
  }

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
    participants: database.Participants.participants
  })
})

router.get('*', (req, res) => {
  res.status(404).json({
    message: "Invalid endpoint."
  })
});

export default router
