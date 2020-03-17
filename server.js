
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
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

    const entries = Object.values(req.body)

    
    /*if(json !== undefined){
    	const jsonVariable = JSON.parse(json)
	console.log(jsonVariable)
    }
    const newEntry = entries[0].split("=")

    const key = newEntry[0]
    console.log(key)
    const value = newEntry[1]

    jsonString = "{"+ key +":"+ value +"}"
    
    fs.writeFileSync("reponses.json", jsonString, function(err) {
         if(err) {
             console.log(err);
         } else {
             res.send("Merci pour cette information !");
         }
    })*/

    if(req.body.msg === 'meteo'){
        res.send("Il fait beau")
    } else if(req.body.msg === 'ville'){
        res.send("Nous sommes a Paris")
    } else {
	if(/ = /.test(req.body.msg)){
	    const [ cle, valeur ] = req.body.msg.split(" = ")
	    fs.writeFileSync('reponses.json', JSON.stringify({ [cle]: valeur}))
	} else {
        const cle = req.body.msg
        const reponses = fs.readFileSync('réponses.json', { encoding: 'utf8' })
        const reponse = JSON.parse(reponses)[cle]
        res.send(cle + ': ' + reponse)
	    
	}
	res.send(req.body.msg)
    }
})

app.listen(PORT, function () {
    console.log('Example app listening on port 3000!')
})

