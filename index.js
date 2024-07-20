import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "Utrt@2002",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [req.body.username]);
    if(result.rows.length > 0){
      res.redirect("/register");
    }
    else{
      await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [req.body.username, req.body.password]);
      res.render("secrets.ejs");
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1 AND password = $2", [req.body.username, req.body.password]);
    if(result.rows.length > 0){
      res.render("secrets.ejs");
    }
    else{
      console.log("Wrong login info");
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
