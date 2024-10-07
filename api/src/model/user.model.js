const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true,
      },
      last_name: {
        type: String,
        required: true,
      },
      date_of_birth: {
        type: String,
        required: true,
      },
      contact_number: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        enum: ["male", "female", "Male", "Female"],
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
        default: "SuperAdmin",
      },
      status: {
        type: Boolean,
        required: true,
        default: true,
      }
}) 

const User = model('User', userSchema);

module.exports = User