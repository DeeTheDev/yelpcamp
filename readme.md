#Show Page
* Review the RESTful routes we've seen so far
* Add description to our campground model (Schema)
* Show db.coollection.drop()
* Add a show route/template

RESTFUL ROUTES

name      url       verb    description
====================================================
INDEX    /dogs      GET     display a list of all dogs
NEW      /dogs/new  GET     display form to make a new dog
CREATE   /dogs      POST    Add new dog to DB
SHOW     /dogs/:id  GET     Shows info about one dog 



#Refactor Mongoose Code
* Create a models directory
* Use module.exports
* Require everything correctly!

#Add Seeds File
* Add seeds.js file
* Run the seeds file every time the server starts

#Add the Comment model
* Make our errors go away!
* Display comments on campground show pag