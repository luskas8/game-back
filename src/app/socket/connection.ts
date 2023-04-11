import { Socket } from "socket.io"
import { InMemoryDatabase } from "../../database"
import { Participant } from "../../entities/Participant"
import { Room } from "../../entities/Room"
import SocketServer from "../../entities/SocketServer"

interface JoinData {
  room_id: string
  participant_id: string
}

export function connection(socket: Socket): void {
  const database = InMemoryDatabase.getIstance()


  console.log("New client connected")

  socket.on("disconnect", () => {
    console.log("Client disconnected")

    const room = database.Rooms.findBySocketId(socket.id)
    socket.leave(room.name)
    room?.removeParticipantBySocket(socket.id)
    database.Participants.removeBySocket(socket.id)
  })

  socket.on("leave", ((data: JoinData) => {
    const participant = database.Participants.find(data.participant_id)
    const room = database.Rooms.findById(data.room_id)

    if (!participant || !room) {
      return
    }

    socket.rooms.delete(data.room_id)
    room.removeParticipant(participant)
    database.Participants.remove(participant)
  }))


  socket.on("join", ((data: JoinData) => {
    const participant = database.Participants.find(data.participant_id)
    const room = database.Rooms.findById(data.room_id)

    if (!participant) {
      const created = database.Participants.add(new Participant(data.participant_id || null, socket))

      if (!created || typeof created === "boolean") {
        console.log("Error creating participant")
        return
      }

      data.participant_id = created.id
      socket.emit("participant_id", { participant_id: created.id })

    } else {
      participant.socket = socket
      database.Participants.update(participant)
    }
    if (!room) {
      database.Rooms.addRoom(new Room(data.room_id, data.participant_id, data.room_id))
    }


    if (socket.rooms.has(data.room_id)) {
      console.log(`${data.participant_id} already in room ${data.room_id}`)
      return
    }

    socket.join(data.room_id)
    if (room) {
      room.addParticipant(participant || database.Participants.find(data.participant_id))
    } else {
      database.Rooms.findById(data.room_id)?.addParticipant(participant || database.Participants.find(data.participant_id))
    }
    console.log(`${data.participant_id} joined room ${data.room_id}`)
    socket.send({ message: "You joined the room." })
  }))

  socket.on("message", (data: { room_id: string, message: string, owner: string }) => {
    const room = database.Rooms.findById(data.room_id)

    if (!room) {
      console.log("Room not found")
      return
    }

    const io = SocketServer.getSocket()

    io.to(data.room_id).emit("message_room", { message: data.message, owner: data.owner })
  })
}
