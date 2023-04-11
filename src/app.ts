import { Express, json, urlencoded } from "express"
import cors from "cors"
import { corsConfig } from "./config/cors"
import { APIError } from "./entities/Error"
import router from "./routes"
import SocketServer from "./entities/SocketServer"
import { connection } from "./app/socket/connection"
import { InMemoryDatabase } from "./database"

export function main(app: Express): boolean {
  try {
    InMemoryDatabase.getIstance()

    app.use(cors())
    app.options("*", cors())
    app.use(corsConfig)
    app.use(json())
    app.use(urlencoded({ extended: true }))
    app.use(router)

    const io = SocketServer.getSocket()

    io.on("connection", connection)



    return true
  } catch(err) {
    new APIError("EXPRESS_ERROR", Http.StatusCode.INTERNAL_SERVER, "Error creating express instance", true)
    return false
  }
}
