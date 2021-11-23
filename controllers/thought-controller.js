const { Thought, User } = require('../models');

const thoughtController = {
   // GET ALL thoughts
   getAllThoughts({ body }, res) {
      Thought.find({})
         .then((dbThoughtData) => res.json(dbThoughtData))
         .catch((err) => res.status(404).json(err));
   },

   // Add thought to User
   addThought({ params, body }, res) {
      console.log(body);
      Thought.create(body)
         .then(({ _id }) => {
            return User.findOneAndUpdate(
               //
               { _id: params.userId },
               { $push: { thoughts: _id } },
               { new: true }
            );
         })
         .then((dbUserData) => {
            if (!dbUserData) {
               res.status(404).json({ message: 'Sorry, no User found with this id.' });
               return;
            }
            res.json(dbUserData);
         })
         .catch((err) => res.json(err));
   },

   getThoughtById({ params }, res) {
      Thought.findOne({ _id: params.thoughtId })
         .select('-__v')
         .then((dbThoughtData) => {
            if (!dbThoughtData) {
               res.status(404).json({ message: "No 'Thought' found with this id." });
               return;
            }
            res.json(dbThoughtData);
         })
         .catch((err) => {
            res.status(400).json(err);
         });
   },

   // UPDATE thought
   updateThoughtById({ body, params }, res) {
      Thought.findOneAndUpdate(
         //
         { _id: params.thoughtId },
         body,
         {
            new: true, // Return the updated version of the document
            runValidators: true, // Enable mongoose runValidators for this schema
         }
      )
         .then((dbThoughtData) => {
            if (!dbThoughtData) {
               return res.status(404).json({ message: "No 'Thought' found with this id." });
            }
            res.json(dbThoughtData);
         })
         .catch((err) => res.json(err));
   },

   // Remove Thought by ID
   removeThoughtById({ params }, res) {
      //* findOneAndDelete() returns more data than .deleteOne() and .deleteMany() methods
      Thought.findOneAndDelete({ _id: params.thoughtId })
         .then((dbUserData) => {
            if (!dbUserData) {
               res.status(404).json({ message: 'No thought found with this id!' });
               return;
            }
            res.json(dbUserData);
         })
         .catch((err) => {
            console.log(err);
            res.status(400).json(err);
         });
   },

   // Remove Thought from User
   removeThoughtFromUser({ params }, res) {
      Thought.findOneAndDelete({ _id: params.thoughtId })
         .then((deletedThought) => {
            if (!deletedThought) {
               return res.status(404).json({ message: "No 'Thought' found with this id." });
            }
            return Thought.findOneAndUpdate(
               { _id: params.userId },
               { $pull: { thoughts: params.thoughtId } },
               { new: true }
            );
         })
         .then((dbUserData) => {
            if (!dbUserData) {
               res.status(404).json({ message: 'Sorry, no User found with this id.' });
               return;
            }
            res.json(dbUserData);
         })
         .catch((err) => res.json(err));
   },

   //! Remove All Thoughts
   removeAllThoughts(req, res) {
      Thought.remove({})
         .then((dbThoughtData) => res.json(dbThoughtData))
         .catch((err) => res.status(404).json(err));
   },

   addReaction({ params, body }, res) {
      Thought.findOneAndUpdate(
         //
         { _id: params.thoughtId },
         { $push: { reactions: body } },
         {
            new: true,
            runValidators: true,
         }
      )
         .then((dbThoughtData) => {
            if (!dbThoughtData) {
               res.status(404).json({ message: 'Sorry, no Thought found with this id.' });
               return;
            }
            res.json(dbThoughtData);
         })
         .catch((err) => res.json(err));
   },

   // Remove Reaction
   removeReactionById({ params }, res) {
      Thought.findOneAndUpdate(
         { _id: params.thoughtId },
         { $pull: { reactions: { reactionId: params.reactionId } } },
         { new: true }
      )
         .then((dbThoughtData) => res.json(dbThoughtData))
         .catch((err) => res.json(err));
   },
};

module.exports = thoughtController;
