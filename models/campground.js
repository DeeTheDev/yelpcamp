var mongoose = require("mongoose");
var Comment = require("./comment");

//schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // refering to this model
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment" // refering to this model schema
        }    
    ]
});
campgroundSchema.pre('remove', async function(next){
    try {
        await Comment.remove({
            "_id": {
                $in: this.comments
            }
        });
        next();
    } catch(err){
        next(err);
    }
});

module.exports = mongoose.model("Campground", campgroundSchema);