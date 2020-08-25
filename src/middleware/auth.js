const jwt= require("jsonwebtoken")
const User = require("../models/users")

const auth = async (req,res,next)=>{
  console.log("auth hit")
  try{
    const token = await req.header("Authorization").replace("Bearer ", "")
    console.log(token)
    const decoded = await jwt.verify(token,process.env.JWT_SECRET)
    console.log(decoded)
    const user = await User.findOne({_id : decoded._id ,"tokens.token": token})
    if(!user){
      throw new Error()
    }
    req.user = user
    req.token = token
    next()
  }
  catch(error){
      res.status(401).send({Error : "please authenticate"})
  }
}


module.exports = auth