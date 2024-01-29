const express = require("express");
const fs = require('fs');
const path = require('path');
const axios=require("axios")
const app = express();
const cors = require("cors");
const xlsx = require('xlsx');
var postmark = require("postmark");
require("dotenv").config();
require("./db/conn");
const PORT = process.env.Port;
const bodyParser = require('body-parser');
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
var userdb = require("./model/userSchema")
var Email = require("./model/emailSchema")
var files=require("./model/Fileschema")

const clientid = process.env.googleclient
const clientsecret = process.env.googlesecret


app.use(cors({
    origin:"http://localhost:3000",
    methods:"GET,POST,PUT,DELETE",
    credentials:true
}));
app.use(express.json());
app.use(bodyParser.json());
// setup session
app.use(session({
    secret:"bharath",
    resave:false,
    saveUninitialized:true
}))

// setuppassport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new OAuth2Strategy({
        clientID:clientid,
        clientSecret:clientsecret,
        callbackURL:"/auth/google/callback",
        scope:["profile","email"]
    },
    async(accessToken,refreshToken,profile,done)=>{
        try {
            let user = await userdb.findOne({googleId:profile.id});

            if(!user){
                user = new userdb({
                    googleId:profile.id,
                    displayName:profile.displayName,
                    email:profile.emails[0].value,
                    image:profile.photos[0].value
                });

                await user.save();
            }

            return done(null,user)
        } catch (error) {
            return done(error,null)
        }
    }
    )
)

passport.serializeUser((user,done)=>{
    done(null,user);
})

passport.deserializeUser((user,done)=>{
    done(null,user);
});


// initialising google ouath login
app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));

app.get("/auth/google/callback",passport.authenticate("google",{
    successRedirect:"http://localhost:3000/dashboard",
    failureRedirect:"http://localhost:3000/login"
}))

app.get("/login/sucess",async(req,res)=>{

    if(req.user){
        res.status(200).json({message:"user Login",user:req.user})
    }else{
        res.status(400).json({message:"Not Authorized"})
    }
})

//logout api

app.get("/logout",(req,res,next)=>{
    req.logout(function(err){

        if(err){return next(err)}
        res.redirect("http://localhost:3000");
    })
})

//getting api data

app.get('/api/data', async (req, res) => {
  try {
    // Attempt to find all records in the MongoDB collection
    const data = await Email.find({}).limit(10);

    // Send the found data as a JSON response
    res.json(data);
  } catch (error) {
    // Handle errors if any occur during the database operation
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// sending email
var client = new postmark.ServerClient(process.env.postmarkapp);

app.post('/api/send-email', async (req, res) => {
    try {
      const { to, subject, body } = req.body;
      client.sendEmail({
        "From": "ugs207230_it.bharath@cbit.org.in",
        "To":to,
        "Subject": subject,
        "HtmlBody": body,
        "TextBody": "Hello from bharath",
        "MessageStream": "outbound"
      });
      // Save email information to MongoDB
      const email = new Email({ to, subject, body });
      await email.save();
  
      res.status(200).json({ message: 'Email information stored successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });




// send bulk mails
  app.post('/api/sendbulk-emails',  async (req, res) => {
    try {
      
      const workbook = xlsx.readFile("49bb2540bc653ed27110bea383907d53.xlsx");
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailAddresses = xlsx.utils.sheet_to_json(worksheet, { header: 'A', defval: '' });

      const {subject, body } = req.body;
      console.log(subject,body);
      
      for (const to of emailAddresses) {
        //console.log(to['A']);
        // Example sending code:
        client.sendEmail({
          "From": "ugs207230_it.bharath@cbit.org.in",
          "To":to['A'],
          "Subject": subject,
          "HtmlBody": body,
          "TextBody": "Hello from bharath",
          "MessageStream": "outbound"
        });
        
        // Save email information to MongoDB
       // const email = new Email({ to, subject, body });
        //await email.save();
      }
  
      res.status(200).json({ message: 'Bulk emails sent and information stored successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });



// For mail history
const POSTMARK_SERVER_TOKEN = 'bb51e43f-3d88-46fe-ad20-efeaf6f9e3cc'; 
app.get('/mailhistory', async (req, res) => {
  try {
    const response = await axios.get('https://api.postmarkapp.com/messages/outbound', {
      headers: {
        'X-Postmark-Server-Token': POSTMARK_SERVER_TOKEN,
      },
      params: {
        count: 100, // For count
        offset: 0, // Offset for paginating through results
        
      },
    });

    const communicationHistory = response.data;
    res.json(communicationHistory);
  } catch (error) {
    console.error('Error fetching communication history:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// run app on port 6005

app.listen(PORT,()=>{
    console.log(`server start at port no ${PORT}`)
})