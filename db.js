
const mysql= require('mysql2')

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Diwane@2004",
  database: "event_db"
});



db.connect((err)=>{
    if(err){
        console.log(err);
        
    }else{
        console.log("database connected");
    }
})


module.exports =db;