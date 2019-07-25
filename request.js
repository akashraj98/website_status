const request = require("request")
const express = require("express")
var bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json());

function data(response,req){

    console.log(response.elapsedTime,response.statusCode);
    time_ms=req.body.time*1000;
    var Time = "";
    if (time_ms < response.elapsedTime){
        Time= "SOMETHING IS WRONG"
    }
    else{Time="ALL GOOD"}
    const send_data = {
        "statusCode": response.statusCode,
        "time":response.elapsedTime,
        "Status":Time
    }
    console.log(send_data);
    return send_data;
}


app.post('/',(req,res)=>{
    var request = request.get(req.body.url,{json:true,time:true})
    res.send(request)

})

app.get('/',(req,res)=>{
    const usr = {
        "url":"www.yoyo.com",
        "text":"This is yoyo"
    }
    res.send(usr)
})
app.listen(3040);
console.log("server running on port 3040")