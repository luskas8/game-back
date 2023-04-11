import express, { Express } from 'express'
import { createServer, Server } from 'http'
import { APIError } from './Error'

export default class ExpressServer {

    private static _instance: Express
    private static _server: Server

    private constructor() {
      // Private constructor, singleton
    }

    public static getApp(): Express {

      if (!this._instance) {
        console.log("Creating new Express instance")
        try {
          this._instance = express()
        } catch (err) {
          new APIError("EXPRESS_ERROR", Http.StatusCode.INTERNAL_SERVER, "Error creating express instance", true)
        }
      }

      return this._instance
    }

    public static getServer(): Server {

      if (!this._server) {
        console.log("Creating new Server instance")
        try {
          this._server = createServer(this.getApp())
        } catch (err) {
          new APIError("SERVER_ERROR", Http.StatusCode.INTERNAL_SERVER, "Error creating server instance", true)
        }
      }

      return this._server
    }
}
