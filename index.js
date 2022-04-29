
const express = require('express')
// const  methodOverride = require("method-override") ;




const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs')
app.use(express.static("public"));

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

app.get('/sampleParam/:name', (req,res)=>{
    const { name } = req.params
    console.log('i got this from the params', name)
    res.render('form')
})

app.get('/user-data', (request, response) => {
    const users =  [{ name: 'kai', age: 32 }, { name: 'jim', age: 140 }, { name: 'susan', age: 19 }]
    users.forEach((user)=>{
        console.log('user:', user)
    })
    response.render('user-data', {
        users: [{ name: 'kai', age: 32 }, { name: 'jim', age: 140 }, { name: 'susan', age: 19 }],
    });
});

app.get('/', (req, res)=>{
    res.render('form')
})

app.post('/hello', (req, res)=>{
     const {fname, lname} = req.body
     console.log(`${fname} ${lname} has submitted a POST request`)
    // Do Whatever You want with is here
    //AKA edit (read... then write) your JSON file with the incoming data
     res.json({success: 'I can really pass back whatever i want'})
})



const PORT = 3004

app.listen(PORT, () => console.log(`app listening on port ${PORT}`))



// for (let i = 0; i < users.length; i++){
// // do my code
// }


// users.forEach((user)=>{
//     // do something
// })