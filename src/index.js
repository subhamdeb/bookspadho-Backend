const express = require("express")
const app = express()

app.get("/", (req,res) => {
    res.send("Hello!")
})






app.listen(3000, ()=> {
    console.log("running on port number: 3000")
})