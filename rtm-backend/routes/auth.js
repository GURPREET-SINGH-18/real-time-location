const router = require("express").Router();
const User = require("../models/Users")
const bcrypt = require("bcrypt")

//REGISTER
router.post('/register', async (req, res) => {
    try {
        // generating and encrypting password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // creating new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
            hotelId: req.body.hotelId,
        });

        //saving user and returning response
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err)
    }
});

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        if(!user){ 
            res.status(404).json("user not found");
            return;
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){ 
            res.status(404).json("Wrong Password");
            return;
        }
        res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err)
    }
})

module.exports = router;