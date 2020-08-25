const mongoose = require('mongoose')
url = "mongodb://localhost/hoteluser"
// url = "mongodb+srv://hotelDB:Babai.Deb.123@subham.mfgak.mongodb.net/<dbname>?retryWrites=true&w=majority"
mongoose.connect(url, {
  useNewUrlParser : true,
  useCreateIndex : true
}
  )

  mongoose.connection.once("open",()=>console.log("connected")).on("error", (error)=> {
      console.log("your error :" + error )
  })