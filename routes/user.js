const express = require("express");
const {
  handleGetAllUsers,
  handleCreateUser,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
} = require("../controllers/user");

const router = express.Router();

// router.get("/users", async (req, res) => {
//     try{
//       const allUsers = await User.find({});
//       const html = `
//       <ol>
//         ${allUsers.map((user) => ` <li>${user.firstName}</li>`).join("")}
//         </ol>
//         `;
//       res.send(html);
//     }catch(error){
//       console.log("Error fetching users : "
//         + error)
//         res.status(500).json({message: error.message});

//     }

//   });

router.route("/").get(handleGetAllUsers).post(handleCreateUser);

router
  .route("/:id")
  .get(handleGetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router;
