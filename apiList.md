# DEVX DevTinder APi LIst

# status : interested, ignored, accepted, rejected

<!-- express.router -->

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRoouter

- GET /myProfile/view
- PATCH /myProfile/edit
- PATCH /myProfile/updatePassword

## connectionRequestRouter

- POST /request/send/interested/:userID
- POST /request/send/ignored/:userID
- POST /request/review/accepted/:requestID
- POST /request/review/rejected/:requestID

## userRouter

- GET /user/feed - gets you profiles of other users in application
- GET /user/connections
- GET /user/requests
