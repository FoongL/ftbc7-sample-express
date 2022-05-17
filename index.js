
const express = require('express')
// const  methodOverride = require("method-override") ;
const { Pool } = require('pg')
const jsSHA = require('jssha')
const cookieParser = require('cookie-parser')




const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(cookieParser())



//connection into postgres
const pgConnectionConfigs = {
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    database: 'ft7',
    port: 5432, // Postgres server always runs on this port
};

const pool = new Pool(pgConnectionConfigs);


// const whenQueryDone = (error, result) => {
//     // this error is anything that goes wrong with the query
//     if (error) {
//         console.log('error', error);
//         return
//     }
//     // rows key has the data
//     console.log(result.rows);

//     // close the connection
//     client.end();
// };

// // write the SQL query
// const sqlQuery = 'SELECT * from cats';

// // run the SQL query
// client.query(sqlQuery, whenQueryDone);




// normal route handling
const handleFruit = (req, res) => {
    const data = {
        fruit: {
            name: "strawberry",
        },
    }


    res.render('fruit', {
        fruit: {
            name: "strawberry",
        },
    })
}

app.get('/fruit', handleFruit)

app.get('/sampleParam/:name', (req, res) => {
    const { name } = req.params
    console.log('i got this from the params', name)
    res.render('form')
})

app.get('/user-data', (request, response) => {
    const users = [{ name: 'kai', age: 32 }, { name: 'jim', age: 140 }, { name: 'susan', age: 19 }]
    users.forEach((user) => {
        console.log('user:', user)
    })
    response.render('user-data', {
        users: [{ name: 'kai', age: 32 }, { name: 'jim', age: 140 }, { name: 'susan', age: 19 }],
    });
});

app.get('/', (req, res) => {
    console.log('MY COOKIES!', req.headers.cookie)
    console.log('my cookies with parser', req.cookies)
    res.render('form')
})

app.post('/hello', (req, res) => {
    const { fname, lname } = req.body
    console.log(`${fname} ${lname} has submitted a POST request`)
    // Do Whatever You want with is here
    //AKA edit (read... then write) your JSON file with the incoming data
    res.json({ success: 'I can really pass back whatever i want' })
})


// client.query in Callbacks
app.get('/all-cats-callback', (req, res) => {
    const sqlQuery = 'SELECT * FROM cats;'
    const whenQueryDone = (err, result) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(result.rows)
    }

    //@params sqlQuery
    pool.query(sqlQuery, whenQueryDone);

    pool.query(sqlQuery, (err, result) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(result.rows)
    })
})


// client.query with promises with a chain of promises
app.get('/all-cats-promise', (req, res) => {

    const sqlQuery = 'SELECT * FROM cats;'

    const handlePromise = (result) => {
        console.log('I am in the first .then(), and i will pass back', result.rows)
        return result.rows
    }
    const secondThen = (secondResult) =>{
        console.log('Second result:', secondResult)
        res.send(secondResult)
    }

    const thirdThen = (thirdResult)=>{
        // will only recieve things returned from secondThen
    }

    pool.query(sqlQuery).then(handlePromise).then(secondThen).then(thirdThen).catch((err) => { res.send(err) })
})




app.get('/cat/:id', (req, res) => {
    const { id } = req.params
    const sqlQuery = `SELECT * FROM cats WHERE id=${id}`
    const whenQueryDone = (err, result) => {
        if (err) {
            res.send(err)
            return
        }
        if (result.rows.length === 0) {
            res.send('No cats want to play with you')
            return
        }
        res.send(result.rows)
    }
    pool.query(sqlQuery, whenQueryDone);
})


// COOKIE SETTING ROUTE
app.get('/cookie-setter', (req, res) => {
    res.cookie('Cookie', 'I made it in here')
    res.send('Cookie has been set')
})


// USER SIGNUP ROUTE
app.get('/signup/:name/:email/:password', (req, res) => {
    const { name, email, password } = req.params
    const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
    shaObj.update(password);
    const hash = shaObj.getHash('HEX');

    const sqlQuery = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${hash}');`
    const whenQueryDone = (err) => {
        if (err) {
            console.log(err)
            res.send(err)
            return
        }
        res.send('User saved into the DB')
    }

    pool.query(sqlQuery, whenQueryDone)

})

app.get('/login/:email/:password', (req, res) => {
    const { email, password } = req.params

    const findUser = `SELECT * FROM users WHERE email = '${email}';`

    const userQueryDone = (err, result) =>{
        if (err){
            console.log(err)
            res.send(err)
            return
        }
        if (result.rows.length === 0) {
            res.send('No such user found')
            return
        }
        const user = result.rows[0]

    const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
    shaObj.update(password);
    const hash = shaObj.getHash('HEX');

        // WE NEED TO COMPARED HASH TO SAVED PASSWORD
        if (hash === user.password){
            res.cookie('logedIn', true)
            res.send('sign in successful')
            return
        }
        res.send('Wrong Password')
    }

    pool.query(findUser, userQueryDone)
    
})


const PORT = 3004

app.listen(PORT, () => console.log(`app listening on port ${PORT}`))

