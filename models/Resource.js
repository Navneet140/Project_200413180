// INSTRUCTIONS
/*
  Create a new resource model that uses the User
  as an associative collection (examples):
  - User -> Books
  - User -> Reservation

  Your model must contain at least three attributes
  other than the associated user and the timestamps.

  Your model must have at least one helpful virtual
  or query function. For example, you could have a
  book's details output in an easy format: book.format()
*/

const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true // This must exist
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: false
  }
}, {
  timestamps: true,
   toJSON: {
    getters: true
  }
});

// Query Helpers
ResourceSchema.virtual('fullname')
.get(function () {
  return `${this.firstName} ${this.lastName}`;
});


module.exports = mongoose.model('Resource', ResourceSchema);