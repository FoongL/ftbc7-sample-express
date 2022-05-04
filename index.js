
const express = require('express')
// const  methodOverride = require("method-override") ;
const { Client } = require('pg')




const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs')
app.use(express.static("public"));



//connection into postgres
const pgConnectionConfigs = {
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    database: 'ft7',
    port: 5432, // Postgres server always runs on this port
};

const client = new Client(pgConnectionConfigs);

client.connect()

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
    res.render('form')
})

app.post('/hello', (req, res) => {
    const { fname, lname } = req.body
    console.log(`${fname} ${lname} has submitted a POST request`)
    // Do Whatever You want with is here
    //AKA edit (read... then write) your JSON file with the incoming data
    res.json({ success: 'I can really pass back whatever i want' })
})

app.get('/all-cats', (req, res) => {
    const sqlQuery = 'SELECT * FROM cats;'
    const whenQueryDone = (err, result) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(result.rows)
    }
    client.query(sqlQuery, whenQueryDone);
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
    client.query(sqlQuery, whenQueryDone);
})


const PORT = 3004

app.listen(PORT, () => console.log(`app listening on port ${PORT}`))

