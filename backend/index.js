import express from "express"
import mysql from "mysql"
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());

const db= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"dissertation"
})

app.post("/login", (req, res) => {
    const { email, password } = req.body;
  
   
    const q = "SELECT * FROM users WHERE email = ? AND password = ?";
    const values = [email, password];
  
    db.query(q, values, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      if (data.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      // You can generate a token here and send it to the client for further authentication
  
      return res.json({ message: "Login successful", user: data[0] });
    });
  });

app.get("/",(req,res)=>{
    res.json("Hello");
})

app.get("/test",(req,res)=>{
    const q = "SELECT * FROM users"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/requests",(req, res)=>{
    const q =  "INSERT INTO requests ('title', 'description', 'file') VALUE (?)";
    const values =[
        req.body.title,
        req.body.description,
        req.body.file,
    ]
   db.query(q,[values],(err, data)=>{
    if(err) return res.json(err);
    return res.json("Request created successfully");
   });
    
});

app.get("/requests/:userId", (req, res) => {
    const userId = req.params.userId;
  
    // Assuming you have a requests table with professor_id column
    const q = "SELECT * FROM requests WHERE professor_id = ?";
    const values = [userId];
  
    db.query(q, values, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      return res.json(data);
    });
  });
  
 
  app.post("/register", (req, res) => {
    const { name, email, faculty, is_student, password } = req.body;
  
    const q = "INSERT INTO users (name, email, faculty, is_student, password) VALUES (?, ?, ?, ?, ?)";
    const values = [name, email, faculty, is_student, password];
  
    db.query(q, values, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      return res.json({ message: "Registration successful", user: data.insertId });
    });
  });
  

app.listen(8500, ()=>{
    console.log("Connected!")
})