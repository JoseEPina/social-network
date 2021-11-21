const { User } = require('../models');

const userController = {
   // GET all users
   getAllUsers(req, res) {
      User.find({})
         // .populate({
         //    path: 'thoughts',
         //    select: '-__v',
         // })
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
         // .populate({
         //    path: 'thoughts',
         //    select: '-__v',
         // })
         .select('-__v') //
         .then((dbUserData) => {
            if (!dbUserData) {
               return res.status(404).json({ message: 'User not found with this id.' });
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

   // DELETE user from database
   deleteUser({ params }, res) {
      User.findOneAndDelete({ _id: params.id })
         .then((dbUserData) => {
            if (!dbUserData) {
               return res.status(404).json({ message: 'User not found.' });
            }
            res.json(dbUserData);
         })
         .catch((err) => res.status(400).json(err));
   },
};

module.exports = userController;
