
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.get('/hello', function(req, res) {
    if(req.query.nom === undefined){
        res.send("Quel est votre nom?")
    } else {
        res.send("Bonjour, "+req.query.nom+"!")
    }
})

app.post('/chat', function(req,res){
    if(req.body.msg === 'meteo'){
        res.send("Il fait beau")
    } else if(req.body.msg === 'ville'){
        res.send("Nous sommes a Paris")
    }
})

app.listen(PORT, function () {
    console.log('Example app listening on port 3000!')
})

