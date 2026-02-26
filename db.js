// database connection
const mysql= require('mysql2')

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "event_db"
});


//to connect to the database
db.connect((err)=>{
    if(err){
        console.log(err);
        
    }else{
        console.log("database connected");
    }
})


module.exports =db;