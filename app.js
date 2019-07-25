
const request = require('request')

function downloadPage(req) {
    return new Promise((resolve, reject) => {
        request.get(req.body.url,{json:true,time:true,followRedirect:true}, (error, response, body,) => {
            if (error){ reject(error)};
            resolve(data(req,response))
        });
    });
}

function data(req,response){
    console.log(response.elapsedTime);
    time_ms=req.body.timeout*1000;
    // console.log(time_ms)
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
    // console.log(send_data);
    return send_data;
}

module.exports ={ downloadPage,data }


