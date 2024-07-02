const mongoose = require("mongoose")
// This line imports the Mongoose library into your Node.js application. Mongoose is an ODM (Object Data Modeling) 
// library for MongoDB and provides a straightforward way to model your application data and interact with MongoDB databases.

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
})
// Here, you define a Mongoose schema using "mongoose.Schema". A schema in Mongoose defines the structure of 
// documents within a collection in a MongoDB database.

module.exports = mongoose.model("users", userSchema)
// This line exports a Mongoose model based on the userSchema. The mongoose.model method creates a model by taking
//  two arguments: the name of the collection (in this case, "users") and the schema (userSchema).

// If we dont provide any value for an attribute, it would leave it as an empty string, but without Mongoose, that attribute 
// wouldn't be added for that object.