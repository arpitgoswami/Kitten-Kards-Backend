import e from "express"
import runApp from "./dbconnection.js"

const app = e()
const port = 3000

app.get('/', (req, res) => {
  res.send(runApp())
})

app.listen(port, () => {
  console.log(`Server is Running on PORT ${port}`)
})