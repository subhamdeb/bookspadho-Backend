const mongoose = require("mongoose");
const validator = require("validator");
const md5 = require("apache-md5")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true,
    trim : true
  },
  email : {
    type:String,
    unique : true,
    trim : true,
    required : true,
    lowercase : true,
    validate(value){
      if(!validator.isEmail(value)){
        // console.log("error, not a Email")
        throw new Error("Email is invalid")
      }
    }
  },
  password :{
    type: String,
    required :true,
    unique : true,
    trim: true,
    minlength : 7 ,// you can use also without using validator 
    validate(value){
      if(value.length < 7){
        throw new Error("password must be above 6 charecter")
      }
    }
  },
  phonenumber : {
    type : Number,
    required: true,
    minlength: 10,
    maxlength : 12

  },
  tokens : [{
    token : {
      type : String
    }
  }],

})

userSchema.methods.generateAuthToken= async function(){
  const user = this
  const token =await jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET)
  user.tokens =await user.tokens.concat({token})
  await user.save()
  return token
} 

userSchema.methods.toJSON=function (){
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

userSchema.statics.findByCredentials = async (email,password)=>{
  const user = await User.findOne({email})
  // console.log("user is" + user)
   if(!user){
     throw new Error("Unable to login")
   }
 
   const isMatch =await md5(password,user.password) === user.password
   console.log(isMatch)
  //  console.log(md5(password))
  //  console.log(user.password)
  //  console.log(md5("abcdef") + "is" + md5("abcdef"))
 
   if(!isMatch){
     throw new Error("Unable to login")
   }
   console.log(user)
   return user
 }
 

 userSchema.statics.findByPhoneNumber = async function(phonenumber){
   console.log("triggered")
   const user = await User.findOne({phonenumber})
  //  console.log("user is :" + user)
   if(!user){
     throw new Error("in correct email and password")
   }

   return user
 }


userSchema.pre('save', async function (next){
  const user = this
  
  if(user.isModified("password")){
    user.password =await md5(user.password)

  }

  next()
})



const User = mongoose.model('User', userSchema )

module.exports = User