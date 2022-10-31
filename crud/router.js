const router = require("express").Router();
const User = require("./models/user.models");
const uuid = require("uuid");

// CRUD OPERATIONS


//CREATE USER

router.post("/createUser", async (req, res) => {
  const requestBody = req.body;
  console.log(requestBody);
  if (!requestBody.username || !requestBody.password || !requestBody.email) {
    res.status(500).json({ error: "Requesr Body is invalid" });
  }
  try {
    const newUser = {
      userId: Math.ceil(Math.random() * 1000),
      username: requestBody.username,
      password: requestBody.password,
      email: requestBody.email,
    };
    const userModel = await new User(newUser);
    userModel
      .save()
      .then((resp) => {
        console.log("User Created", resp);
        res
          .status(201)
          .json({ message: "User Created Successfully", response: resp });
      })
      .catch((err) => {
        console.log("User Creation Failed", err);
        res
          .status(500)
          .json({ message: "User Creation Failed", response: err });
      });
  } catch (err) {
    console.log("error while creating user", err);
  }
});


// UPDATE USER


router.put("/updateUser/:userId", async (req, res) => {
  const requestBody = req.body;
  const userId = req.params.userId;
  if (!userId) {
    res.status(500).json({ error: "User Id is missing" });
  }
  if (!requestBody.username || !requestBody.password || !requestBody.email) {
    res.status(500).json({ error: "Request Body is Invalid" });
  }
  const userObj = await User.findOne({ userId });
  if (!userObj) {
    res.status(500).json({ message: "User Id is not found in db", error });
  }
  userObj.username = requestBody.username;
  userObj.email = requestBody.email;
  userObj.password = requestBody.password;

  try {
    const updateResponse = await userObj.save();
    res
      .status(200)
      .json({ message: "User Updated successfully", response: updateResponse });
  } catch (error) {
    console.log("User Updation Failed", error);
    res.status(500).json({ message: "User Updation Failed", error });
  }
});


//GET ALL USERS

router.get("/getAllUsers", async (req, res) => {
  try {
    const userData = await User.find();
    res.status(200).json({ message: "User data fetched", userData });
  } catch (error) {
    console.log("Error while fetching the data", error);
    res.status(500).json({ message: "Error while fetching the data", error });
  }
});
module.exports = router;

// GET SINGLE USER

router.get("/getUser/:userId", async (req, res) => {
  const userId = req.params.userId;
  const userData = await User.findOne({ userId });
  if (!userData) {
    res.status(500).json({ error: "user id not found in database" });
  }
  try {
    res.status(200).json({ message: "User data fetched", userData });
  } catch (error) {
    console.log("Error while fetching the data", error);
    res.status(500).json({ message: "Error while fetching the data", error });
  }
});

// DELETE DATA

router.delete("/deleteUser/:userId", async (req, res) => {
  const userId = req.params.userId;

  const userObj = await User.findOne({ userId });
  if (!userObj) {
    res.status(500).json({ error: "User Id not found in db" });
  }

  try {
    const deleteResponse = await userObj.delete();
    res
      .status(200)
      .json({ message: "User deleted successfully", response: deleteResponse });
  } catch (error) {
    console.log("User deletion Failed", error);
    res.status(500).json({ message: "User deletion Failed", error });
  }
});
