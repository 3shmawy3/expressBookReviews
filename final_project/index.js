const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    //Write the authenication mechanism here
    if(req.session.authorization) { // Check if the authorization object exists in the session
        let token = req.session.authorization['accessToken']; // Get the access token

        // Verify the token using the secret key (assuming "access" will be the secret used for signing)
        jwt.verify(token, "access", (err, user) => {
            if(!err){
                // If token is valid, attach user info to the request and proceed
                req.user = user;
                next();
            } else {
                // If verification fails (e.g., expired or invalid token)
                return res.status(403).json({message: "User not authenticated or token expired"})
            }
        });
    } else {
        // If no authorization object exists in the session
        return res.status(403).json({message: "User not logged in"})
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
