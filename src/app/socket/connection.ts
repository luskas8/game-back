import { Socket } from "socket.io"
import { InMemoryDatabase } from "../../database"
import SocketServer from "../../entities/SocketServer"
import { APIError } from "../../entities/Error"
import { Message } from "../../@types/socket"

interface JoinData {
  room_id: string
  participant_id: string
}

export interface ChooseCharacterData extends JoinData {
  character: string
}

export function connection(socket: Socket): void {
  const database = InMemoryDatabase.getIstance()
  const io = SocketServer.getSocket()

  console.log("New client connected")

  socket.on("disconnect", () => {
    console.log("Client disconnected")

    const room = database.Rooms.findBySocketId(socket.id)
    if (!room) {
      new APIError("ROOM_NOT_FOUND", 404, "Room not found", true)
      return
    }
    socket.leave(room.name)
    room.removeParticipantBySocket(socket.id)
    database.Participants.removeBySocket(socket.id)
  })

  socket.on("leave", ((data: JoinData) => {
    const participant = database.Participants.find(data.participant_id)
    const room = database.Rooms.findById(data.room_id)

    if (!participant || !room) {
      return
    }

    socket.leave(data.room_id)
    room.removeParticipant(participant)
    database.Participants.remove(participant)
  }))

  socket.on("join", ((data: JoinData) => {
    try {
      const participant = database.Participants.upsert(data.participant_id, socket)
      const room = database.Rooms.findByIdOrAdd(data.room_id, participant.id)
      const roomsParticpant = room.participants.find(p => p.id === participant.id)

      if (data.participant_id !== participant.id) {
        io.to(socket.id).emit("participant_id", { participant_id: participant.id })
      }
      if (roomsParticpant && roomsParticpant.id === participant.id) {
        console.log(`Particpant[${participant.id}] \x1b[31malready in\x1b[37m Room[${room.id}]`)
        return
      }

      socket.join(room.id)
      room.addParticipant(participant)

      console.log(`Participant[${participant.id}] \x1b[32mjoined\x1b[37m Room[${room.id}]`)
      socket.send({ message: "\x1b[32mYou joined the room.\x1b[37m" })
    } catch (error) {
      new APIError("SOCKET_ERROR", 500, "Error creating participant or room", true)
    }
  }))

  socket.on("message", (data: Message) => {
    console.log(data)
    const room = database.Rooms.findById(data.room_id)

    if (data.message === "ping") {
      socket.emit("message", { message: "pong" })
    }

    if (data.message === "start") {
      console.log("start")
      io.to(room.name).emit("start")
    }
  });

  socket.on("character", (data: JoinData) => {
    const { participant_id, room_id } = data

    const game = database.Games.findByRoomIdOrAdd(room_id)

    const players = game.players
    const player = players.find(p => p.participant_id === participant_id)

    if (!player) {
      const startPlayer = players.find(p => p.participant_id === null)
      if (!startPlayer) {
        socket.emit("message", { message: "Game full" })
        return
      }

      startPlayer.participant_id = participant_id
      io.to(socket.id).emit("your_character", { player: startPlayer })
      return startPlayer
    }

    io.to(socket.id).emit("your_character", { player })
    return player
  })

  socket.on("available_characters", (data: JoinData) => {
    const { room_id } = data

    const game = database.Games.findByRoomIdOrAdd(room_id)

    const availableCharacters = game.availableCharacters()

    io.to(socket.id).emit("available_characters", { availableCharacters })
  })

  socket.on("choose_character", (data: ChooseCharacterData) => {
    const { participant_id, room_id, character } = data

    const game = database.Games.findByRoomIdOrAdd(room_id)

    const player = game.players.find(p => p.participant_id === participant_id)
    const characterPlayer = game.players.find(p => p.name === character)

    if (!player) {
      return
    }

    player.participant_id = null
    characterPlayer.participant_id = participant_id

    const availableCharacters = game.availableCharacters()
    io.to(room_id).emit("available_characters", { characters: availableCharacters, sender: participant_id })
  })
}
