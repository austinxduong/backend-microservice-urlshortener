require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');
const urlparser = require('url')
const dns = require('dns')



const client = new MongoClient(process.env.DB_URL);
const db = client.db("urlshortener");
const urls = db.collection("urls");

const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/public', express.static(`${process.cwd()}/public`))


app.get('/', function(req, res){
    res.sendFile(process.cwd() + '/views/index.html')
})

app.get('/api/hello', function(req, res){
    res.json({ greeting: "hello api"})
})

app.post('/', function(req, res){
    
    const url = req.body.url
    console.log(req.body)
    const dnslookup = dns.lookup(urlparser.parse(url). hostname, async (err, address) => {
        if (!address) {
            res.json({ error: 'invalid url' })
        } else {
            const urlCount = await urls.countDocuments({})
            const urlDoc = {
                url,
                short_url: urlCount
            }

        const result = await urls.insertOne(urlDoc)
        console.log(result);
        res.json({ original_url: url, short_url: urlCount })
        }
    })
})

app.listen(port, function(){
    console.log(`Listening on port ${port}`);
})