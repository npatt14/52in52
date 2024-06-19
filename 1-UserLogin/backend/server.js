import express, { json } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import pkg from 'pg';


const SALT_WORK_FACTOR = 10;
const { Pool } = pkg;

// password : rohdin-cazhaQ-7hofre
//Create new pool
const PG_URI = 'postgres://postgres.wflkbmtxutcixiovklfp:rohdin-cazhaQ-7hofre@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'

const pool = new Pool({
    connectionString: PG_URI
});

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());


app.post('/signup', async (req, res) => { // user posts username passw and email when they sign up
    // destructure username, passw, and email from req body
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).send('All fields are required');
     }
    
    try {
    const hashedPassword = await bcrypt.hash(password, SALT_WORK_FACTOR);
    const result = await pool.query(
        'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *', 
        [username, hashedPassword, email]
    );
    
    res.status(200).json({ userId: result.rows[0].id}); // return the first index from the object that is result
    } catch (err) {
        res.status(400).json({ error: err.message});
    }
});

app.post('/login', async (req, res) => { // user TESTS username passw and email AGAINST users in existing db to see if they ARE a user, if theyre not we route them to signup 
    // destructure username and password
    const { username, password } = req.body;

    try {   
    const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
    );
    if (result.rows.length === 0) {
        return res.status(400).json({error: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({error: "Invalid Credientials" });
    }
    res.status(200).json({ message: 'Login successful' });
    } catch {
        res.status(500).json({ error: err.message });
    }
});

app.get('/success', async (req, res) => { // if all is well, and the password inputted and username are in the db, redirect user to secret page for a surprise 

});

// stretch feature, add a 'forget your password option' 


// catch all route handler for any request 
app.use((req, res) => res.status(404).send('This is not the page you\'re looking for...'));



// default error handler for middleware 
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});


// start server
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
