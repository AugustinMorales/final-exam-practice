import express from 'express';
import mysql from 'mysql2/promise';
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
//for Express to get values using the POST method
app.use(express.urlencoded({extended:true}));
//setting up database connection pool
const pool = mysql.createPool({
    host: "wiad5ra41q8129zn.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "pmn02a9lculhup69",
    password: "gu47c367fxd2erj4",
    database: "iav3aaca9hmtnqhr",
    connectionLimit: 10,
    waitForConnections: true
});
//routes
app.get('/', async (req, res) => {
    try {
        // creates an array called sites which houses the info from the fe_comic_sites table
        const [sites] = await pool.query("SELECT * FROM fe_comic_sites");
        // creates the random comic variable
        const [randomComic] = await pool.query("SELECT * FROM fe_comics ORDER BY RAND() LIMIT 1");
        // res.render loads an ejs page
        res.render('index', { sites, randomComic: randomComic[0]});
        // catchs errors async functions needs a try catch block
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});


// get route runs when the user enters the page
app.get('/addComic', async (req, res) =>{
    try{
        // 
        const [sites] = await pool.query("SELECT * FROM fe_comic_sites");
        // this is what takes you to the addComic.ejs page {sites} passes sites to the addComic.ejs page
        res.render('addComic', { sites });
    }
    catch (err){
        console.error("Database error: ", err);
        res.status(500).send("Database Error!");
    }
});


app.post('/addComic', async (req, res) => {
    try{
        const {comicUrl, comicTitle, comicSiteId, comicDate} = req.body;
        await pool.query(
            "INSERT INTO fe_comics (comicUrl, comicTitle, comicSiteId, comicDate) VALUES (?, ?, ?, ?)",
            [comicUrl, comicTitle, comicSiteId, comicDate]
        );
        res.redirect('/');
    }
    catch (err){
        console.error("Database error:", err);
        res.status(500).send("Database error!");

    }
});

app.get('/randomComic', async (req, res) => {
    try{
        const [randomComic] = await pool.query("SELECT * FROM fe_comics ORDER BY RAND() LIMIT 1");
        res.json(randomComic[0]);
    }
    catch (err) {
        console.error("Database error: ", err);
        res.status(500).send('Database error');
    }
});


app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest
app.listen(3000, ()=>{
    console.log("Express server running")
})