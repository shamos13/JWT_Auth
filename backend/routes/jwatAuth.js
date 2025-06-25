const router = require("express").Router();
const pool = require("../db")
const bcrypt = require("bcrypt")
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo")
const authorization= require("../middleware/authorization")

// Register
router.post("/register", validInfo, async (req,res) => {
    try{
       // 1. destructure req.body (name, email, password)
       const {name, email, password} = req.body
       // 2. Check if user exists if true throw error
       const userExists = await pool.query("SELECT * FROM users WHERE user_email=$1",[email]);
       
       if (userExists.rows.length > 0){
        return res.status(401).json({
            error: "user already exists!!"
        })
       }
       // 3. Bcrypt the user password
       const hashedPassword = await bcrypt.hash(password, 10);
       // 4. Enter the new user in db
       const newUser = await pool.query("INSERT INTO users(user_name,user_email,user_password) VALUES ($1,$2,$3) RETURNING *",[name,email,hashedPassword]);
       

       // 5. Generating jwt
       const token = jwtGenerator(newUser.rows[0].user_id);
       res.json({token})


    } catch (err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Login Route

router.post("/login", validInfo, async (req,res) => {
    try{
        // 1. Destructure req.body
        const {email,password} = req.body;
        
        // 2. Check if user doesn't exist if true throw error
         const userExists = await pool.query("SELECT * FROM users WHERE user_email=$1",[email]);
         if (userExists.rows.length === 0){
            return res.status(401).json("Password or email is incorrect");

         }

        // 3. check password if its same
        const validPassword = await bcrypt.compare(password,userExists.rows[0].user_password); 
        
        if(!validPassword){
            return res.status(401).json({
                error : "Invalid Password or Email"
            })
        }

        // 4. Give them the jwt token
        const token = jwtGenerator(userExists.rows[0].user_id);
        res.json(token);

    } catch(err){
        console.error(err.message);
    }
});

// Authorization
router.get("/is-verify",authorization ,async (req,res)=> {
    try {
        res.json(true);
        
    } catch (err) {
         console.error(err.message);
         res.status(500).send("Server Error");
    }
})
module.exports = router;