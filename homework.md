- Create a repository
- Initialize the repository
- node_modules, package.json, package-lock.json
- Install express
- Create a server
- Listen to port 7777
- Write request handlers for /test , /hello
- Install nodemon and update scripts inside package.json
- What are dependencies
- What is the use of "-g" while npm install
- Difference between caret and tilde ( ^ vs ~ )

- initialize git
- .gitignore
- Create a remote repo on github
- Push all code to remote origin
- Play with routes and route extensions ex. /hello, / , hello/2, /xyz
- Order of the routes matter a lot
- Install Postman app and make a workspace/collectio > test API call
- Write logic to handle GET, POST, PATCH, DELETE API Calls and test them on Postman
- Explore routing and use of ?, + , (), * in the routes
- Use of regex in routes /a/ , /.*fly$/
- Reading the query params in the routes
- Reading the dynamic routes

- Multiple Route Handlers - Play with the code
- next()
- next function and errors along with res.send()
- app.use("/route", rH, [rH2, rH3], rH4, rh5);
- What is a Middleware? Why do we need it?
- How express JS basically handles requests behind the scenes
- Difference app.use and app.all
- Write a dummy auth middleware for admin
- Write a dummy auth middleware for all user routes, except /user/login
- Error Handling using app.use("/", (err, req, res, next) = {});

- Create a free cluster on MongoDB official website (Mongo Atlas)
- Install mongoose library
- Connect your application to the Database "Connection-url"/devTinder
- Call the connectDB function and connect to database before starting application on 7777
- Create a userSchema & user Model
- Create POST /sigup API to add data to database
- Push some documents using API calls from postman
- Error Handling using try , catch

- JS object vs JSON
- add the express.json middleware to my app
- make signup API dynamic
- Model.find vs Model.findone . if theres 2 doc/data with same email id how will it behave?
- delete api
- find the diff between Patch and Put
- update user API
- Explore Mongoose API models

- explore schematype options from the doc
- improved the DB Schema using required, unique, lowercase, trim
- add timeStamps to userSchema
- add API level validation to PATCH request & sigUP POST api
- Data sanitization - add api level validation for each field
- diff between API level validation and DB level validation. what is the point of same validation in both place ?????

- using validator.js npm library for validation
- used validator fn for password , email and photoURl and others
- never trust req.body

- ENCRIPTION and PASSWORD
- validate data in signup api
- create password hash using bcrypt library and used bcrypt.hash & bcrypt.compare
- login api

- Authentication & JWT
- install cookie-parser lib
- just send dummy cookie to user and check in postman
- create a get profile API & check if you get the cookie back
- install jsonwebtoken lib by auth0 to create validate JWT tokens
- in login API, after email and password validation , create a JWT token & send it to user
- read the cookie inside profile API and find the logIN user
- ?? how the cookies get automatically sent in getProfile API after initial logIn

- auth Middleware
- userAuth Middleware
-
