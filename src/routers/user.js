const express = require('express')
const router = new express.Router()
const User = require('../models/users')
const auth = require("../middleware/auth")

//message function
const {sendConfirmationMessage, sendOTPmessage, verifyOTPmessage} = require('../messages/twilioservice');

router.get("/",(req,res) => {
  res.send("hello")
})


router.post("/api/signup",async (req,res)=> {
  console.log("Hello")
  
  const user = new User(req.body)
  console.log(user)
  try {
    await user.save()
    console.log(user)
    
    console.log("runn")
    const token =await user.generateAuthToken()
    res.status(201).send({user,token})
    sendConfirmationMessage(user.phonenumber)
  }
  catch(error){
    res.status(401).send(error)
  }
})


router.post("/api/login",async (req,res)=>{
  console.log("hello")
  try{
    const user = await User.findByCredentials(req.body.email, req.body.password)
    // console.log(user)
    const token = await user.generateAuthToken()
    // console.log(token)
    console.log(user.password)
    res.send({user, token})
  }catch(error){
    res.status(400).send()
  }
})

router.get("/api/readuser",auth,(req,res)=>[
      res.send(req.user)
])


router.post('/api/loginwithnumber',async (req,res)=>{
  try{
    const number = parseInt(req.body.phonenumber)
    const user =await User.findByPhoneNumber(number)
    console.log(user)
    
    // console.log(number)
    // const user = await user.findByPhoneNumber(7908762277)
    // console.log(user)
    sendOTPmessage(number)
    res.send(user)

  }
  catch(error){
      res.status(401).send("failed")
  }
})

router.post("/api/verifyotp", verifyOTPmessage,async(req,res) => {
    if(req.verifystatus){
      try{
        const number = parseInt(req.body.number)
        const user =await User.findByPhoneNumber(number)
        console.log(user)
        const token = await user.generateAuthToken()
        console.log(token)
        res.send({user, token})
        // console.log(number)
        // const user = await user.findByPhoneNumber(7908762277)
        // console.log(user)
    
      }
      catch(error){
          res.status(401).send("failed")
      }
    }
    else{
      res.status(401).send("wrong number")
    }
})





module.exports = router
