const express = require('express')
const bodyParser = require('body-parser')
const luk = require('./app')

const app = express();

app.use(bodyParser.json()) // for parsing application/json

app.post('/',async (req,res)=>{
    try {
        // await downloadPage(req)
        // try downloading an invalid url
        var response =await luk.downloadPage(req)
        res.send(response)
    } catch (error) {
        console.error('ERROR:');
        console.error(error);
    }
    });
app.get('/',(req,res)=>{
     const user={
        //  "url":"www.google.com",
         "text":"hi there"
     };
     res.send(user)
 })

app.listen(3004);
console.log("server runing on 3004 port")
