import { data } from "react-router-dom"
import fs from 'fs';
import { error } from "console";

function sanitize(string) {
  const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
      "\r": '',
  };
  const reg = /[&<>"'/]/ig;
  return string.replace(reg, (match)=>(map[match]));
}
function slightlysanitize(string) {
  const map = {
      '<': '',
      '>': '',
      '"': '',
      "'": '',
  };
  const reg = /[<>"']/ig;
  return string.replace(reg, (match)=>(map[match]));
}
const applicable = "qwertyuiopasdfghjklzxcvbnm1234567890"
const idsize = 60
export const generateId = () => {
    return Array.from({length: idsize}).flatMap(() => {
        return applicable.charAt(Math.floor(applicable.length*Math.random()))
    }).join('')
}
export const checkId = (sessionid) => {
    sessionid.array.forEach(element => {
        if(applicable.charAt(element) < 0){
            return false
        }
    });
    return sessionid.length == idsize
}
export const checkIdea = async (database, title) => {
    return (await database.prepare(`SELECT Id FROM IDEAS WHERE Title LIKE '${slightlysanitize(title)}'`).all()).length <= 0
}
export const insertUser = (database, obj) => {
    if(typeof(obj["Email"]) !== "string"){
        console.trace(`Error inserting user `, obj)
        return
    }
    try {
        database.exec(
            `INSERT INTO USERDATA VALUES ('${slightlysanitize(obj["Email"])}', 
            '${slightlysanitize(obj["Picture"])}')`)
    } catch(e) {
        console.error(`Error executing SQL statement when inserting User '${obj}' : ${e}`)
    }
}
export const insertPodcast = (database, obj) => {
    try {
        database.exec(
            `INSERT INTO PODCASTS (Id, Url, Title, Description, Date, Author) 
            VALUES ((SELECT COUNT(Id) FROM PODCASTS), '${slightlysanitize(obj["url"])}', '${slightlysanitize(obj["title"])}', 
            '${slightlysanitize(obj["description"])}', ${Date.now()}, '${slightlysanitize(obj["author"])}')`)
    } catch(e) {
        console.error(`Error executing SQL statement when inserting Podcast '${obj}' : ${e}`)
    }
}
export const insertIdea = (database, obj) => {
    try {
        database.exec(
            `INSERT INTO IDEAS (Id, Title, Date, Author) 
            VALUES ((SELECT COUNT(Id) FROM IDEAS), '${slightlysanitize(obj["Title"])}', ${Date.now()}, '${slightlysanitize(obj["Author"])}')`)
    } catch(e) {
        console.error(`Error executing SQL statement when inserting Idea '${obj.toString()}' : ${e}`)
    }
}
export const insertVote = (database, obj) => {
    if(typeof(obj["IdeaId"]) !== "number"){
        console.error(`Error: ${obj["IdeaId"]} is not a valid IdeaId `, obj)
        return
    }
    try {
        database.exec(
            `INSERT INTO VOTES (Id, Email, IdeaId) 
            VALUES ((SELECT COUNT(Id) FROM VOTES), '${slightlysanitize(obj["Email"])}', ${obj["IdeaId"]})`)
    } catch {
        console.error(`Error executing SQL statement when inserting Podcast '${obj.toString()}'`)
    }
}
export const insertWinner = (database, obj) => {
    if(typeof(obj["IdeaId"]) !== "number"){
        console.error(`Error: ${obj["IdeaId"]} is not a valid winner `, obj)
        return
    }
    try {
        database.exec(
            `INSERT INTO IDEAWINNERS (Id, Email, IdeaId, Date) 
            VALUES ((SELECT COUNT(Id) FROM IDEAWINNERS), 
            '${slightlysanitize(obj["Email"])}', ${obj["IdeaId"]}, ${Date.now()})`)
    } catch {
        console.error(`Error executing SQL statement when inserting Podcast '${obj.toString()}'`)
    }
}
export const getWinners = async (database) => {
    try {
        return await database.prepare(
            `SELECT * FROM IDEAS WHERE Id IN (SELECT IdeaId FROM IDEAWINNERS) ORDER BY Date DESC`).all()
    } catch(e) {
        console.error(`Error executing SQL statement while getting idea winners : `, error)
    }
}
export const getCurrentWinner = async (database) => {
    try {
        return await database.prepare(
            `SELECT * FROM IDEAS WHERE Id NOT IN (SELECT IdeaId FROM IDEAWINNERS) 
            AND Id = (SELECT IdeaId FROM VOTES 
            WHERE IdeaId NOT IN (SELECT IdeaId FROM IDEAWINNERS) GROUP BY IdeaId ORDER BY COUNT(IdeaId) DESC LIMIT 1) LIMIT 1`).all()
    } catch(e) {
        console.error(`Error executing SQL statement while getting idea winners : `, e)
    }
}
export const deleteVote = (database, obj) => {
    if(typeof(obj["IdeaId"]) !== "number"){
        console.error(`Error: ${obj["IdeaId"]} is not a valid IdeaId (${obj})`)
        return
    }
    try {
        database.exec(
            `DELETE FROM VOTES WHERE IdeaId = ${obj["IdeaId"]} AND Email LIKE '${obj["Email"]}'`)
    } catch {
        console.error(`Error executing SQL statement when inserting Podcast '${obj.toString()}'`)
    }
}
export const checkVote = async (database, ideaId, email) => {
    return (await database.prepare(`SELECT * FROM VOTES WHERE IdeaId = ${ideaId} AND Email LIKE '${slightlysanitize(email)}'`).all()).length < 1
}
export const getNumVotes = async (database, ideaId) => {
    return (await database.prepare(`SELECT * FROM VOTES WHERE IdeaId = ${ideaId}`).all()).length
}
export const clearDataErrors = (database) => {
    database.exec("DELETE FROM USERDATA WHERE Email = 'undefined' OR EMAIL = '' OR Email LIKE '%\r%'")
}
export const getUsers = async (database) => {
    clearDataErrors(database)
    return database.prepare("SELECT * FROM USERDATA").all()
    .flatMap((o) => {return {...o,
        "Admin": isAdmin(o["Email"])
    }})
}
export const findUser = async (database, email) => {
    clearDataErrors(database)
    return database.prepare(`SELECT * FROM USERDATA WHERE Email LIKE '${slightlysanitize(email)}' LIMIT 1`).all()
    .flatMap((o) => {return {...o,
        "Admin": isAdmin(o["Email"])
    }})
}
export const getIdeas = async (database) => {
    const ideas = await database.prepare("SELECT * FROM IDEAS WHERE Id NOT IN (SELECT IdeaId FROM IDEAWINNERS)").all()
    for(let i = 0; i < ideas.length; i++){
        ideas[i] = {...ideas[i], "Votes":(await getNumVotes(database, ideas[i]["Id"]))}
    }
    return ideas
}
export const getAllIdeas = async (database) => {
    const ideas = await database.prepare("SELECT * FROM IDEAS").all()
    for(let i = 0; i < ideas.length; i++){
        ideas[i] = {...ideas[i], "Votes":(await getNumVotes(database, ideas[i]["Id"]))}
    }
    return ideas
}
export const getPodcasts = async (database) => {
    return database.prepare("SELECT * FROM PODCASTS").all()
}
export const initDatabase = async (database) => {
    const sqls = [
        `CREATE TABLE IF NOT EXISTS 
        USERDATA(
        Email TEXT PRIMARY KEY NOT NULL, 
        Image TEXT NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS 
        IDEAS(
        Id INT, 
        Title TEXT NOT NULL, 
        Date BIGINT NOT NULL,
        Author TEXT NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS
        PODCASTS(
        Id INT,
        Url TEXT NOT NULL,
        Title TEXT NOT NULL,
        Description TEXT,
        Date BIGINT NOT NULL,
        Author TEXT NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS
        VOTES(
        Id INT,
        Email TEXT NOT NULL,
        IdeaId INT
        )`,
        `CREATE TABLE IF NOT EXISTS
        IDEAWINNERS(
        Id INT,
        IdeaId INT NOT NULL,
        Email TEXT NOT NULL,
        Date BIGINT NOT NULL
        )`
        //`INSERT OR IGNORE INTO USERDATA VALUES ('riley.wen68@masonohioschools.com', '')`,
        //`INSERT OR IGNORE INTO PODCASTS VALUES (0, 'https://www.youtube.com/embed/1U2CPg42_OM?si=jBeJ3CJdS-v_hKsJ', 
        //'Test Title', 'Test Description', 42, 'Untitled Author')`,
    ]
    for(let i = 0; i < sqls.length; i++){
        database.exec(sqls[i])
    }
}
export const generateString = (length) => {
    const samples = "qwertyuiopasdfghjklzxcvbnnnm"
    var string = ""
    for(var i = 0; i < length; i++){
        string += samples.charAt(Math.floor(Math.random() * samples.length))
    }
    return string;
}
export const addAdmin = (adminName) => {
    fs.appendFile(adminFile, adminName+"\n")
}
export const isAdmin = (adminName) => {
    try {
        const data = fs.readFileSync("./database/admin.txt", "utf-8");
        if(typeof(adminName) !== "string" || adminName === ""){
            console.error(`Invalid admin name queried (got: ${adminName})`)
            return false
        }
        const admins = data.toString().split("\r\n")
        for(let i = 0; i < admins.length; i++){
            if(admins[i] === adminName){
                return true
            }
        }
    } catch {
        console.error("Something went wrong reading admin file")
    }
    return false
}