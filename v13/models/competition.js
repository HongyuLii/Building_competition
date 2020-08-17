var mongoose  = require("mongoose");

//SCHEMA SETUP
var competitionSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    data: String,
    conclusion: String,
    author: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
     },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Competition", competitionSchema);