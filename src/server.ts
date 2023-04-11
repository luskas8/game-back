import * as Application from "./app"
import ExpressServer from "./entities/ExpressServer"

const app = ExpressServer.getApp()
const server = ExpressServer.getServer()

Application.main(app)

server.listen(3333, () => {
  console.log("\x1b[32m>> Server running on port 3333\n>> Access http://localhost:3333\n\x1b[31m>> Press CTRL-C to stop <<\x1b[37m")
})
