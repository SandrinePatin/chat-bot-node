
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
	    //Version Synchrone
        //fs.writeFileSync('reponses.json', JSON.stringify({ [cle]: valeur}))

        //Version async
        readValuesFromFile((err, valeursExistantes) => {
        if (err) {
          res.send('error while reading réponses.json', err)
        } else {
          const data = JSON.stringify({
            ...valeursExistantes,
            [cle]: valeur
          });
          fs.writeFile('réponses.json', data, (err) => {
            console.log('appel au callback de writefile')
            if (err) {
              console.error('error while saving réponses.json', err)
              res.send('Il y a eu une erreur lors de l\'enregistrement')
            } else {
              res.send('Merci pour cette information !')
            }
          });
          console.log('appel à writefile effectué')
        }
      })


	} else {
        const cle = req.body.msg
        /*const reponses = fs.readFileSync('réponses.json', { encoding: 'utf8' })
        const reponse = JSON.parse(reponses)[cle]
        res.send(cle + ': ' + reponse)*/

        readValuesFromFile((err, values) => {
            if (err) {
                res.send('error while reading réponses.json', err)
            } else {
                const reponse = values[cle]
                res.send(cle + ': ' + reponse)
            }
        })
	    
	}
	res.send(req.body.msg)
    }
})

app.listen(PORT, function () {
    console.log('Example app listening on port 3000!')
})

function readValuesFromFile(callback) {
    fs.readFile('réponses.json', { encoding: 'utf8' }, (err, reponses) => {
        if (err) {
            callback(err);
        } else {
            const valeursExistantes = JSON.parse(reponses);
            callback(null, valeursExistantes);
        }
    });
}

