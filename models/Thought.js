const { Schema, model, Types } = require('mongoose'); //* import Schema schema and model function
const dateFormat = require('../utils/dateFormat');

const ReactionSchema = new Schema(
   {
      reactionId: {
         type: Schema.Types.ObjectId,
         default: () => new Types.ObjectId(),
      },
      reactionBody: {
         type: String,
         required: true,
         maxlength: 280,
      },
      username: {
         type: String,
         required: true,
      },
      createdAt: {
         type: Date,
         default: Date.now,
         get: (createdAtVal) => dateFormat(createdAtVal),
      },
   },
   {
      toJSON: {
         getters: true,
      },
   }
);

const ThoughtSchema = new Schema(
   {
      thoughtText: {
         type: String,
         required: 'Please enter your thought!',
         minlength: 1,
         maxlength: 280,
         // validate: [({ length }) => length >= 1 && length <= 280, 'Thought should be longer than one character.'],
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
      // use ReactionSchema to validate data for a 'reaction'
      reactions: [ReactionSchema],
   },
   // Set the `toJSON` schema option to use virtuals
   // Set the `id` as false
   {
      toJSON: {
         virtuals: true,
         getters: true,
      },
      id: false,
   }
   //
);

//! Create a virtual called 'reactionCount' that retrieves
//! the length of the thought's reactions array field on query
ThoughtSchema.virtual('reactionCount').get(function () {
   return this.reactions.length;
});

//! create Thought model using ThoughtSchema
const Thought = model('Thought', ThoughtSchema);

module.exports = Thought; // exports the Thought model
