console.log("hii");
const express = require("express");
const app = express();
const port = 3000;
const {validatorsignupData} = require("./utils/validation");
const connectDb = require("./config/database");

const User = require("./models/user");
const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/signup", async (req, res) => {

  try {
  validatorsignupData(req);
  const {firstName, lastName, email, password} = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hashedPassword);

  console.log("🔥 Signup route was hit!");
  console.log(req.body, "-----------------");

  const user = new User({ firstName, lastName, email, password: hashedPassword });

  // const user = new User({
  //   firstName: "John",
  //   lastName: "Doe",
  //   email: "John@example.com",
  //   password: "password123",
  // });
  //

    await user.save();
    console.log("User saved successfully:", user);
    res.send("User added successfully");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Error saving user");
  }
});

// app.get("/users", async (req, res) => {
//   const useremail = req.query.email;
//   try {
//     const user = await User.findOne({ email: useremail });
//     res.send(user);
//   } catch (err) {
//     console.error("Error fetching user:", err);
//     res.status(500).send("Error fetching user");
//   }
// });
// *******************QUERY PARAMETERS*****************

// app.get("/search", (req, res) => {
//   console.log(req.query.keyword);
//   console.log(req.query.sort);

//   res.send(`Searching for: ${req.query.keyword}, Sorted by: ${req.query.sort}`);
// });

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const user = await User.findOne({ email: userEmail });

    if (user.length === 0) {
      return res.status(404).send("User not found");
    }

    res.send(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Error fetching user");
  }
});

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id; // Gets id from the URL

  try {
    const user = await User.findById(userId); // Use findById for MongoDB _id

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Error fetching user");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    console.log(user, "-----------------");
    res.send(user);
  } catch (err) {
    console.error("Error fetching feed:", err);
    res.status(500).send("Error fetching feed");
  }
});

app.delete("/users", async (req, res) => {
  const userid = req.body.userid;

  try {
    const user = await User.findByIdAndDelete(userid);
    res.send("user deleted successfully");
  } catch (err) {
    res.status(500).send("Error deleting user");
    console.error("Error deleting user:", err);
  }
});



app.patch("/user",async (req, res) => {
  const userid = req.body.userid;
  const data = req.body;

  try {
    const user = await User.findByIdAndUpdate(userid, data,{runValidators:true});
    console.log(user, "-----------------");
    res.send("user updated successfully");
  } catch (err) {
    res.status(500).send("Error updating user");
    console.error("Error updating user:", err);
  }
});

connectDb()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log(`server is running on port 3000`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
