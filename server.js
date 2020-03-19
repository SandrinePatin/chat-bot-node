const express = require('express');
const util = require('util');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const PORT = process.env.PORT || 3000;
const DATABASE_NAME = "chat-bot";
const uri = `mongodb+srv://yunie:san0999@cluster0-jp6gm.azure.mongodb.net/test?retryWrites=true&w=majority`;

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function readValuesFromFile(callback) {
    const reponses = await readFile('réponses.json', { encoding: 'utf8' });
    return JSON.parse(reponses);
}

let collection;
const app = express();
app.use(express.json());

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/hello', function(req, res) {
    if(req.query.nom === undefined){
        res.send("Quel est votre nom?")
    } else {
        res.send("Bonjour, "+req.query.nom+"!")
    }
})

app.post('/chat', async function(req,res){

    async function saveMessage(reply){
        //Insert a single entry
        await collection.insertOne({from: 'user', message: req.body.msg,});
        await collection.insertOne({from: 'bot',msg: reply})
        res.send(reply);
    }

    if(req.body.msg === 'meteo'){
        saveMessage("Il fait beau");
    } else if(req.body.msg === 'ville'){
        saveMessage("Nous sommes a Paris");
    } else {
        if(/ = /.test(req.body.msg)){
            const [ cle, valeur ] = req.body.msg.split(" = ");
            //Version async
            let valeursExistantes;
            try {
                valeursExistantes = await readValuesFromFile();
            } catch (err) {
                res.send('error while reading réponses.json', err);
                return
            }
            const data = JSON.stringify({
                ...valeursExistantes,
                [cle]: valeur
            });
            try {
                await writeFile('réponses.json', data);
                saveMessage('Merci pour cette information !')
            } catch (err) {
                console.error('error while saving réponses.json', err);
                saveMessage('Il y a eu une erreur lors de l\'enregistrement')
            }
        } else {
            const cle = req.body.msg;
            try {
                const values = await readValuesFromFile()
                const reponse = values[cle]
                saveMessage(cle + ': ' + reponse)
            } catch (err) {
                saveMessage('error while reading réponses.json', err)
            }
        }
    }
});

app.get('/messages/all', function(req, res) {
    client.connect(async err => {
        const messages = client.db("chat-bot").collection("messages");
        const message = await messages.find({}).toArray();
        console.log(message);
        res.send(message);
    });
});

;(async () => {
    console.log(`Connecting to ${DATABASE_NAME}...`);
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect()
    collection = client.db(DATABASE_NAME).collection("messages");
    console.log(`Successfully connected to ${DATABASE_NAME}`);
    app.listen(PORT, function () {
        console.log('Example app listening on port 3000!')
    })
    // await client.close() // should be done when the server is going down
})()
