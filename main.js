import e from "express"

const app = e()
const port = 3000
const status = "    [ Status OK ]"
const a = {"message":"Welcome to Thunder Client","about":"Lightweight Rest API Client for VSCode","createdBy":"Ranga Vadhineni","launched":2021,"features":{"git":"Save data to Git Workspace","themes":"Supports VSCode Themes","data":"Collections & Environment Variables","testing":"Scriptless Testing","local":"Local Storage & Works Offline"},"supports":{"graphql":true,"codeSnippet":true,"requestChaining":true,"scripting":true}}

app.get('/', (req, res) => {
  res.send(a)
})

app.listen(port, () => {
  console.log(`Server is Running on PORT ${port}: ${status}`)
})