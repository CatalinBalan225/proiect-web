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

app.post("/requests", async (req, res) => {
    const { title, description, file, professor_id } = req.body;
  
    try {
     
        const professorDetails = await axios.get(`http://localhost:8500/professors`);
        const professorId = professorDetails.data.find((prof) => prof.id === professor_id)?.id;
  
     
        const q = "INSERT INTO requests (title, description, file, professor_id, status, student_id) VALUES (?, ?, 'photo.png', ?, 'awaiting','0')";
        const values = [title, description, file, professorId];
        db.query(q, values, (err, data) => {
        if (err) {
            console.error('Error inserting request:', err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
        
          return res.json("Request created successfully");
        });
    } catch (error) {
      console.error('Error during request creation:', error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
 

app.get("/requests/:userId", (req, res) => {
    const userId = req.params.userId;
    const isStudent = req.query.isStudent; // Add this line to get the isStudent query parameter

    let q;
    let values;

    if (isStudent === "1") {
       
        q = "SELECT * FROM requests";
        values = [];
    } else {
       
        q = "SELECT * FROM requests WHERE professor_id = ?";
        values = [userId];
    }

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

  app.get("/professors", (req, res) => {
    const q = "SELECT * FROM users WHERE is_student = 0";
    db.query(q, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      return res.json(data);
    });
  });
  

app.listen(8500, ()=>{
    console.log("Connected!")
})