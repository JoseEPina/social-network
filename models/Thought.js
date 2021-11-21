const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
   {
      thoughtText: {
         type: String,
         required: 'Please enter your thought!',
         validate: [({ length }) => length >= 1 && length <= 280, 'Thought should be longer than one character.'],
      },

      userCreated: {
         type: Date,
         default: Date.now(),
         //* define getter; each time we retrieve createdAt, it will be formatted by dateFormat()
         get: (createdAtVal) => dateFormat(createdAtVal),
      },

      username: {
         type: String,
         required: 'Please enter your username.',
      },
   },
   // Set the `toJSON` schema option to use virtuals
   // Set the `id` as false
   {
      toJSON: {
         virtuals: true,
      },
      id: false,
   }
   //
);

//! Create a virtual called 'reactionCount' that retrieves
//! the length of the thought's reactions array field on query
UserSchema.virtual('reactionCount').get(function () {
   return this.reactions.length + 1;
});

const User = model('User', UserSchema);

module.exports = User;
