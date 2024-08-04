const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");

const app = express();
const PORT = 8000;

// connecting to mongoDB

mongoose
  .connect("mongodb://127.0.0.1:27017/firstMongo-db")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Error connecting to MongoDB" + err));

// database schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    gender: {
      type: String,
      // required: true,
      // enum: ["Male", "Female", "Other"] // can only be Male, Female or Other
    },
    jobTitle: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

// middleware

app.use(express.urlencoded({ extended: false }));

// log every requests
app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `Request Method: ${req.method}; Req URL : ${req.url}; at ${Date()}\n`,
    (err) => {
      if (err) console.log("Error logging the request to the log.txt");
      else console.log("Log file updated.");
      next();
    }
  );
});

//Routes
app.get("/", (req, res) => {
  res.send("Server is running !");
});

//APIs
app.get("/users", async (req, res) => {
  try{
    const allUsers = await User.find({});
    const html = `
    <ol>
      ${allUsers.map((user) => ` <li>${user.firstName}</li>`).join("")}
      </ol>
      `;
    res.send(html);
  }catch(error){
    console.log("Error fetching users : " 
      + error)
      res.status(500).json({message: error.message});

  }
  
});

//apis

app
  .route("/api/users")
  .get(async (req, res) => {
    try{
      const users = await User.find({});
      res.json(users);
    }catch(error){
      console.log("Error fetching users : " + error)
      res.status(500).json({message: error.message});
    }
 
  })
  .post(async (req, res) => {
try {
  const {firstName, lastName, email, gender, jobTitle} = req.body;
      if (
        !firstName ||
        !lastName ||
        !email ||
        !gender ||
        !jobTitle
      ) {
        res
          .status(400)
          .json({ message: "Some field(s) Error. All fields are required!" });
      }

      const existingUserEmail = await User.findOne({email})
      if(existingUserEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        gender ,
        jobTitle
      });
      console.log("New user created :", newUser);
      return res.status(201).json({ message: "Successfully created" });
} catch (error) {
  console.log("Error creating user : " + error.message)
  res.status(500).json({ message: error.message });
}
  });

app.route("/api/users/:id").get(async (req, res) => {
try {
    const user = await User.findById(req.params.id);
  
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
} catch (error) {
  console.log("Error fetching user", error);
  return res.status(500).json({ message: "Internal server error" });
}
}).patch(async(req,res)=>{
try {
  const {email}= req.body;
  const id = req.params.id;
  if(email){
    const existingUserEmail = await User.findOne({email});
    if(existingUserEmail && existingUserEmail._id.toString()!== id){
      return res.status(400).json({ message: "Email already exists" });
    }
  }
    const user = await User.findByIdAndUpdate(id, req.body, {new: true});
    
    if(user){
      return res.json(user);
    }else{
      return res.status(404).json({ message: "User not found" });
    }
} catch (error) {
console.log("Error updating user", error)
return res.status(500).json({ message: "Internal server error" });
}

}).delete(async (req, res) => {
try {
    const user = await User.findByIdAndDelete(req.params.id)
  if(user){
   const totalUsersLeft = await User.countDocuments({})
  return  res.status(200).json({ message: "User deleted successfully", deletedUserId : req.params.id, totalUsersLeft:totalUsersLeft });

  }
    else{
      return res.status(404).json({ message: "User not found" });
    }
} catch (error) {
  console.log("Error updating user", error)
return res.status(500).json({ message: "Internal server error" });
}
});

app.listen(PORT, () => {
  console.log("Server is running on the port " + PORT);
});
