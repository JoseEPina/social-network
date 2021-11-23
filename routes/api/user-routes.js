const router = require('express').Router();

const {
   //
   getAllUsers,
   getUserById,
   createUser,
   updateUser,
   deleteUser,
   deleteAllUsers,
   addFriend,
   removeFriend,
} = require('../../controllers/user-controller');

//? Set up GET all and POST at /api/users
router
   .route('/') //
   .get(getAllUsers)
   .delete(deleteAllUsers)
   .post(createUser);

//? Set up GET one, PUT, and DELETE at /api/users/:id
router //
   .route('/:id')
   .get(getUserById)
   .put(updateUser)
   .delete(deleteUser);

//? Set up POST to add one Friend DELETE to remove a Friend
//? at /api/users/:userId/friends/:friendId
router //
   .route('/:userId/friends/:friendId')
   .post(addFriend)
   .delete(removeFriend);

module.exports = router;
