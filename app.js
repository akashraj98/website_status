
const request = require('request')

function downloadPage(req) {
    return new Promise((resolve, reject) => {
        request.get(req.body.url,{json:true,time:true,followRedirect:true}, (error, response, body,) => {
            if (error){ reject(iferror(error))}
            else{resolve(data(req,response))}
        });
    });
}

function data(req,response){
    console.log(response.elapsedTime);
    time_ms=req.body.timeout*1000;
    // console.log(time_ms)
    var statusTxt = "";
    if (time_ms < response.elapsedTime){
        statusTxt= "LATE RESPONSE"
    }
    else{statusTxt="ALL GOOD"}
    const send_data = {
        "statusCode": response.statusCode,
        "time":response.elapsedTime,
        "Status":statusTxt
    }
    // console.log(send_data);
    return send_data;
}

function iferror(error){
    const send_data={
        "statusCode": 404,
        "time":-1,
        "Status":"NO RESPONSE" 
    }
    // console.log(error);
    return send_data;
}
module.exports ={ downloadPage,data }


