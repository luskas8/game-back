import { Server } from "socket.io"
import { APIError } from "./Error"
import ExpressServer from "./ExpressServer"


export default class SocketServer {
  private static _instance: Server

  private constructor() {
    // Private constructor, singleton
  }

  public static getSocket(): Server {
    if (!this._instance) {
      console.log("Creating new Socket instance")
      try {
        this._instance = new Server(ExpressServer.getServer(), {
          cors: {
            origin: "*",
            methods: ["GET", "POST"]
          }
        })
      } catch (err) {
        new APIError("SOCKET_ERROR", Http.StatusCode.INTERNAL_SERVER, "Error creating socket instance", true)
      }
    }

    return this._instance
  }
}
