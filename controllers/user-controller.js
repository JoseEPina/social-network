const {User} = require('../models');

const userController = { 
   // GET all users
   getAllUsers(req, res)
   {
      User.find({})

   }

}