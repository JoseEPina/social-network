const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const friendSchema = new Schema({

})

const UserSchema = new Schema(
   {
      username: {
         type: String,
         trim: true,
         required: 'A username is required',
         unique: true,
      },

      email: {
         type: String,
         unique: true,
         required: 'An email address is required',
         match: [/.+@.+\..+/, 'Please enter a valid e-mail address'],
      },

      thoughts: [
         {
            type: Schema.Types.ObjectId,
            ref: 'Thought',
         },
      ],

      friends: [
         {
            type: Schema.Types.ObjectId,
            ref: 'User',
         },
      ],

      userCreated: {
         type: Date,
         default: Date.now(),
         //* define getter; each time we retrieve createdAt, it will be formatted by dateFormat()
         get: (createdAtVal) => dateFormat(createdAtVal),
      },
   },
   {
      toJSON: {
         virtuals: true, //* enable mongoose virtuals for this schema
         getters: true, //* enable mongoose getters for this schema
      },
      id: false, //* mongoose virtuals do not need id
   }
   //
);

//! Create a virtual called `friendCount` that retrieves the
//! length of the user's friends array field on query
UserSchema.virtual('friendCount').get(function () {
   return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;
