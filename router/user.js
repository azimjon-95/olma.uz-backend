const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {config} = require("dotenv");
// const auth = require("../middleware/auth")
config();

const {userValidate, User} = require("../model/userSchema");

router.get("/",  async(req, res)=>{
    try{
        let users = await User.find()
       
        
        res.status(200).json({state: true, msg: "All admins", innerData: users})
    }
    catch{
        res.status(500).json({state: false, msg: "Server error", innerData: null})
    }
})

router.post("/", async(req, res)=>{
    try{
        const {value, error} = userValidate(req.body)
        if (error) {
            return res.status(400).json({state: false, msg: error.details[0].message, innerData: null})
        }
    
        // username bir hil bulmasligi kerak?
        const exactTeacher = await User.findOne({username: value.username})
        if (exactTeacher) {
            return res.status(400).json({state: false, msg: "username is already been taken", innerData: null})
        }
    
        const createUser = await User.create(value);
     
        //hash - Parolni hashlash
        // const salt = await bcrypt.genSalt(10)
        // createUser.password = await bcrypt.hash(createUser.password, salt)

        const saveUser = await createUser.save();
        res.status(201).json({state: true, msg: "User was saved", innerData: saveUser})
    }
    catch{
        res.status(500).json({state: false, msg: "Server error", innerData: null})
    }
})

// Update user
router.put("/:_id", async(req, res)=>{
    try{
        let updatedUser = await User.findByIdAndUpdate(req.params._id, req.body)
        res.json({state: true,msg: " User is updated", data: updatedUser});
    }
    catch{
        res.status(500).json({state: false, msg: "Server error", innerData: null})
    }
})

// login parolni delete qilish  (LOGOUT)
router.delete("/:_id", async(req, res)=>{
    try{
        const deleteUser = await User.findByIdAndDelete(req.params._id)
        res.status(200).json({state: true, msg: "User is deleted", innerData: deleteUser})
    }
    catch{
        res.status(500).json({state: false, msg: "Server error", innerData: null})
    }
})

router.post("/sign-in", async(req, res)=>{
    try{
        const {username, password} = req.body;
        // username password borlogini tekshirish
        if (!username || !password) {
            return res.status(403).json({state: false, msg: "Username or password is empty", innerData: null})
        }
        
        // username mosligini tekshirish
        const exactUser = await User.findOne({username})
        if (!exactUser) {
            return res.status(400).json({state: false, msg: "Username or password is incorrect", innerData: null})
        }

        // passwordmi mosligini tekshirish
        if (exactUser.password !== password) {
            return res.status(400).json({state: false, msg: "Username or password is incorrect", innerData: null})
        }

        // token berish
        const token  = jwt.sign({_id: exactUser._id, username, isUser:exactUser.isUser},
            process.env.PRIVATE_KEY
        )

        // front uchun passwordni yashirish
        // exactUser.password = "*".repeat(exactUser.password.length) 

        // Frontend ga muvofaqqiyatli yuborish
        res.status(200).json({state: true, msg: "Successfully sign in", innerData: {user: exactUser, token}})
    }
    catch{
        res.status(500).json({state: false, msg: "Server error", innerData: null})
    }
})
module.exports = router;