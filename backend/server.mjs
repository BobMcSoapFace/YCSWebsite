import { DatabaseSync }  from 'node:sqlite';
import express, { response } from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { insertUser, generateString, initDatabase, getUsers, findUser, isAdmin, getPodcasts, getIdeas, insertIdea, generateId, insertVote, checkVote, deleteVote, insertPodcast, insertWinner, getWinners, getCurrentWinner, getNumVotes, checkIdea } from './databaseManager.mjs';
import { OAuth2Client } from 'google-auth-library';
import https from 'https'
import fs from 'fs'

import cors from 'cors'
import axios from 'axios'
import {config} from 'dotenv'
import { getRandomValues } from 'crypto';
import { data } from 'react-router-dom';
config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
const app = express()
const port = 60001

const database_name = "database.sqlite3"
const databaseFolder = __dirname + "/database"
const backupFolder = databaseFolder + "/backups"
const database = new DatabaseSync(databaseFolder + "/" + database_name);

initDatabase(database)
//debug output
console.log("server started")

//output http requests
app.use((req, res, next) => {
  next()
  console.log((req.headers['x-forwarded-for'] || req.socket.remoteAddress) + " - " + req.method + " " + req.url + " - " + res.statusCode)
})
const SESSION_LENGTH = 20*60000 //20 minutes (in ms)
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_ID_SECRET
const HIDE_VOTE_AUTHORS = true
// Environment-specific origins
const allowedOrigins = [
  'http://localhost',  // Development
  //'http://192.168.2.200',      // Development
  CLIENT_ID,
  'https://oauth2.googleapis.com/token',
  'https://mason.ycsweb.club'
];
const oAuth2Client = new OAuth2Client(
  CLIENT_ID,
  CLIENT_SECRET,
  'postmessage',
);
const sessions = (() => {
    var usersessions = {}
    const sessionValid = (user) => {
        if(typeof(user) !== "string"){
          console.log("Invalid user: " + toString(user))
          return
        }
        if(usersessions[user] == undefined){
          return false
        } else {
          if(Date.now() - usersessions[user] >= SESSION_LENGTH){
            delete usersessions[user]
            return false
          } else {
            return true
          }
        }
      }
    const clearInvalidSessions = () => {
      for(const [id, _] of Object.entries(usersessions)){
        if(!sessionValid(id)){
          delete usersessions[id]
        }
      }
    }
    return {
      getSessions : () => {
        clearInvalidSessions()
        return usersessions
      },
      insertSession : (email) => {
        clearInvalidSessions()
        if(typeof(email) !== "string"){
          console.log("Invalid email: " + toString(email))
          return
        }
        let id = generateId()
        console.log("Email: " + email + ", session_id: " + id)
        usersessions[id] = {
          Date:Date.now(),
          Email:email,
        }
        return id
      },
      sessionValid : sessionValid
    }
})()

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    // if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json())
app.post('/data/send-idea', async (req, res) => {
  try {
    const sessionid = req.body["sessionId"]
    let email = null; 
    try{email = sessions.getSessions()[sessionid]["Email"]}
    catch(e){
      res.json({
        response:"Log in required!"
      }) 
      res.end()
      return
    }
    if(req.body.title === '' || req.body.title === undefined){
      res.send({response:"Cannot be empty!"})
      res.end()
      return;
    }
    findUser(database, email).then(async(users) => {
      if(users.length >= 1) {
        if(!(await checkIdea(database, req.body.title))){
          res.send({response:"Idea already exists!"})
          res.end()
          return
        }
        insertIdea(database, {
          Title:req.body.title,
          Author:email,
        })
        console.log("Email: ", email, ", Submitted Idea:", req.body.title)
        res.send({response:"Successfully submitted!"})
        res.end()
      } else {
        console.error('Submitting idea from user ' + email + " failed, not found in database")
      }
    })
  } catch(e) {
    console.error('Sent idea error: ', e)
    res.json({response:"Error processing request"})
  }
})
app.post('/data/send-podcast', async (req, res) => {
  try {
    const sessionid = req.body["sessionId"]
    let email = null; 
    try{email = sessions.getSessions()[sessionid]["Email"]}
    catch(e){
      res.send({
        response:"Log in required!"
      }) 
      res.end()
      return
    }
    if(!isAdmin(email)){
      res.send({
        response:"Admin permission required!"
      }) 
      return
    }
    if(!req.body["url"].includes("embed")){
      res.send({
        response:"Must use Youtube embedded link! (see below)"
      }) 
      return
    }
    findUser(database, email).then((users) => {
      if(users.length >= 1) {
        insertPodcast(database, req.body)
        console.log("Email: ", email, ", Submitted podcast:", req.body)
        res.send({response:"Successfully submitted!"})
        res.end()
      } else {
        console.error('Submitting podcast from user ' + email + " failed, not found in database")
      }
    })
  } catch(e) {
    console.error('Sent idea error: ', e)
    res.json({response:"Error processing request"})
  }
})
app.post('/data/send-winner', async (req, res) => {
  try {
    const sessionid = req.body["sessionId"]
    let email = null; 
    try{email = sessions.getSessions()[sessionid]["Email"]}
    catch(e){
      res.send({
        response:"Log in required!"
      }) 
      res.end()
      return
    }
    if(!isAdmin(email)){
      res.send({
        response:"Admin permission required!"
      }) 
      return
    }
    findUser(database, email).then(async (users) => {
      if(users.length >= 1) {
        const winner = await getCurrentWinner(database)
        if(winner.length <= 0){
          res.send({response:"No winners found!"})
          res.end()
          return
        }
        if((await getNumVotes(database, winner[0]["Id"])) <= 1){
          res.send({response:"Winner must have more than 1 vote!"})
          res.end()
          return
        }
        insertWinner(database, {
          IdeaId:winner[0]["Id"],
          Email:email
        })
        console.log("Email: ", email, ", submitted winner")
        res.send({response:"Successfully submitted!"})
        res.end()
      } else {
        console.error('Submitting winner from user ' + email + " failed, not found in database")
      }
    })
  } catch(e) {
    console.error('Sent idea error: ', e)
    res.json({response:"Error processing request"})
  }
})
app.post('/data/vote-idea', async (req, res)=>{
  try {
    const sessionid = req.body["sessionId"]
    let email = null
    try{
      email = sessions.getSessions()[sessionid]["Email"]
    } catch(e) {
      res.send({response:"Need to log in!"})
      res.end()
      return
    }
    if(typeof(req.body.IdeaId) !== "number"){
      throw new Error("Requested voted idea from "+ email+ " is not a number ("+ req.body.IdeaId+ ")")
    }
    findUser(database, email).then(async (users) => {
      if(users.length < 1) {
        console.error('Voting on idea from user ' + email + " failed, not found in database")
        res.json({response:"User not found"})
        res.end()
        return
      }
      if(!(await checkVote(database, req.body.IdeaId, email))){
        console.log('Rejected vote from user ', email, ' on idea ', req.body.IdeaId, ', already voted')
        res.json({response:"Unvoted on idea"})
        res.end()
        deleteVote(database, {
          Email:email,
          IdeaId:req.body.IdeaId,
        })
        return
      }
      insertVote(database, {
        Email:email,
        IdeaId:req.body.IdeaId,
      })
      console.log("Email: ", email, ", Voted Idea:", req.body.IdeaId)
      res.send()
    })
  } catch(e){
    console.error('Vote idea error: ', e)
  }
})
app.get('/data/users', (req, res) => {
  getUsers(database).then((emails) => {
    res.send({"Users":emails})
    res.end()
  })
})
app.get("/data/pods", (req, res) => {
  getPodcasts(database).then((pods) => {
    res.send({"Podcasts":pods})
    res.end()
  })
})
app.get("/data/ideas", (req, res) => {
  getIdeas(database).then((ideas) => {
    res.send({"Ideas": HIDE_VOTE_AUTHORS ? ideas.flatMap((obj) => {return {...obj, "Author":""}}) : ideas})
    res.end()
  })
})
app.get("/data/winners", (req, res) => {
  getWinners(database).then((winners) => {
    res.send({"Winners": winners})
    res.end()
  })
})
app.post("/data/auth/callback", async (req, res)=>{
  try {
    // Exchange authorization code for access token
    const {tokens} = await oAuth2Client.getToken(req.body.code);
    const userInfo = await axios
      .get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })
      .then(res => res.data);
    console.log(userInfo["email"]+" logged in with picture "+userInfo["picture"])   
    const user = await findUser(database, userInfo["email"])
    if(user.length <= 0){
      insertUser(database, {
        Email:userInfo["email"],
        Picture:userInfo["picture"],
      })
    }
    const sessionid = sessions.insertSession(userInfo["email"])
    res.cookie("Email", userInfo["email"], {maxAge: 900000, httpOnly: false})
    res.cookie("Fullname", userInfo["name"], {maxAge: 900000, httpOnly:false})
    res.cookie("SessionId", sessionid, {maxAge: SESSION_LENGTH, httpOnly:false})
    res.cookie("Admin", isAdmin(userInfo["email"]), {maxAge: 900000, httpOnly:false})
    
    res.end()
    // const { access_token, id_token } = data;

    // // Use access_token or id_token to fetch user profile
    // const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
    //   headers: { Authorization: `Bearer ${access_token}` },
    // });

    // Code to handle user authentication and retrieval using the profile data
  } catch (error) {
    console.error('Error:', error);
  }
})
app.get(/^\/data\/(.+)/, (req, res) => {
  try {
    let num = parseInt(req.params[0])
    if(isNaN(num) || num <= 0){
      throw new Error("Invalid input")
    }
    res.status(200).send({"output":req.params[0]})
  } catch(e) {
    res.status(400)
  }
  res.end()
})

// init function
const serverStart = () => {
  console.log(`Server listening`)
}
app.listen(port, serverStart)
//production use
// https.createServer({
//   key:fs.readFileSync('privkey.pem file loc here'),
//   cert:fs.readFileSync('fullchain.pem file loc here')
// }, app).listen(port, serverStart)