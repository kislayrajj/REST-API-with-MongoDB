const User = require("../models/user");
const handleGetAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.log("Error fetching users : " + error);
    res.status(500).json({ message: error.message });
  }
};

const handleCreateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, gender, jobTitle } = req.body;
    if (!firstName || !lastName || !email || !gender || !jobTitle) {
      res
        .status(400)
        .json({ message: "Some field(s) Error. All fields are required!" });
    }

    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      gender,
      jobTitle,
    });
    console.log("New user created :", newUser);
    return res
      .status(201)
      .json({ message: "Successfully created", id: newUser._id });
  } catch (error) {
    console.log("Error creating user : " + error.message);
    res.status(500).json({ message: error.message });
  }
};

const handleGetUserById = async (req, res) => {
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
};

const handleUpdateUserById = async (req, res) => {
  try {
    const { email } = req.body;
    const id = req.params.id;
    if (email) {
      const existingUserEmail = await User.findOne({ email });
      if (existingUserEmail && existingUserEmail._id.toString() !== id) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error updating user", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const handleDeleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      const totalUsersLeft = await User.countDocuments({});
      return res.status(200).json({
        message: "User deleted successfully",
        deletedUserId: req.params.id,
        totalUsersLeft: totalUsersLeft,
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error updating user", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  handleGetAllUsers,
  handleCreateUser,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
};
