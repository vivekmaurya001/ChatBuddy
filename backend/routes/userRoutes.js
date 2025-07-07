const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { allUsers, UpdateUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const JWT_SECRET = "Flutio@5665#";
const cloudinary = require("../Cloudinary");

//ROUTE 1:end point for creating new user in db
router.post("/", async (req, res) => {
  let success = false;
  try {
    const { pic } = req.body;
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ error: "sorry user with this email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    let Url;
    if (pic) {
      const result = await cloudinary.uploader.upload(pic, {
        folder: "UsersImage",
      });
      Url = result.url;
      console.log(result);
    }

    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
      pic: Url,
    });

    const data = {
      user: {
        id: user._id,
      },
    };
    const auhToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, auhToken, user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});
//ROUTE 2:authenticating a user using :POST "/api/user/login
router.post("/login", async (req, res) => {
  let success = false;
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "plase try to login with correct credentials" });
    }
    const passwordcompare = await bcrypt.compare(password, user.password);
    if (!passwordcompare) {
      success = false;
      return res
        .status(400)
        .json({ success, error: "plase try to login with correct password" });
    }
    const data = {
      user: {
        id: user.id,
      },
    };
    const auhToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, auhToken, user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});

//ROUTE 3:getting all users
router.route("/").get(protect, allUsers);

//for updating user details
router.route("/update").put(protect, UpdateUser);

module.exports = router;
