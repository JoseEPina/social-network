const { User, Thought } = require('../models');

const userController = {
   // GET all users
   getAllUsers(req, res) {``
      User.find({})
         .populate({
            path: 'thoughts',
            select: '-__v',
         })
         .select('-__v') //
         .sort({ _id: -1 })
         .then((dbUserData) => res.json(dbUserData))
         .catch((err) => {
            console.log(err);
            res.status(400).json(err);
         });
   },

   // GET one user by ID
   getUserById({ params }, res) {
      User.findOne({ _id: params.id })
         .populate({
            path: 'thoughts',
            select: '-__v',
         })
         .select('-__v') //
         .then((dbUserData) => {
            if (!dbUserData) {
               return res.status(404).json({ message: 'User not found with this ID.' });
            }
            res.json(dbUserData);
         })
         .catch((err) => {
            console.log(err);
            res.status(400).json(err);
         });
   },

   // POST to add a user to the database
   createUser({ body }, res) {
      console.log(body);
      User.create(body)
         .then((dbUserData) => res.json(dbUserData))
         .catch((err) => res.status(400).json(err));
   },

   // PUT to update user by ID
   updateUser({ params, body }, res) {
      User.findOneAndUpdate(
         { _id: params.id }, //
         body, //
         { new: true, runValidators: true }
      ) //
         .then((dbUserData) => {
            if (!dbUserData) {
               return res.status(404).json({ message: 'User not found.' });
            }
            res.json(dbUserData);
         })
         .catch((err) => res.status(400).json(err));
   },

   //! DELETE ONE user by id & its associated thoughts - METHOD
   deleteUser({ params }, res) {
      User.findOne({ _id: params.id })
         .then((dbUserData) => {
            if (!dbUserData) {
               res.status(404).json({ message: 'No user found with this id!' });
               return;
            }
            return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
         })
         .then((dbUserData) => {
            User.findOneAndDelete({ _id: params.id })
               .then((dbUserData) => {
                  res.json(dbUserData);
               })
               .catch((err) => {
                  res.status(400).json(err);
               });
         })
         .catch((err) => res.status(400).json(err));
   },

   //! DELETE ALL Users
   deleteAllUsers(req, res) {
      User.remove({}).then((dbUserData) => res.json(dbUserData));
   },

   // Add a Friend
   addFriend({ params }, res) {
      User.findOneAndUpdate(
         { _id: params.userId },
         { $push: { friends: params.friendId } },
         { new: true, runValidators: true }
      )
         .then((dbUserData) => {
            if (!dbUserData) {
               res.status(404).json({ message: 'User not found with this ID.' });
               return;
            }
            res.json(dbUserData);
         })
         .catch((err) => res.json(err));
   },

   // Remove Friend
   removeFriend({ params }, res) {
      User.findOneAndUpdate(
         //
         { _id: params.userId },
         { $pull: { friends: params.friendId } },
         { new: true }
      )
         .then((dbUserData) => res.json(dbUserData))
         .catch((err) => res.json(err));
   },
};

module.exports = userController;
