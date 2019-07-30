var fromEmail = ""; //Fill
var replyToEmail = "";
var uptimeSlackChannelWebhookUrl = ""; //FILL
var warningAlertIconUrl = "http://www.myiconfinder.com/uploads/iconsets/256-256-d126274718a0e884768ab345d31b53c0-alert.png";
var successAlartIconUrl = "https://thejibe.com/sites/default/files/article/images/ok-icon.png";
var statusUp = "UP";
var statusDown = "DOWN";

function monitorWebsite(){
  var sheetData = getWebsiteSheetValues();
  for (index = 0;index < sheetData.length;index++){
    var website = sheetData[index][1];
    var reportingEmail = sheetData[index][2];
    var toMonitor = sheetData[index][3].toString().toLowerCase() == "true";
    var timeout = sheetData[index][4];
//  Logger.log(reportingEmail);
    if(!toMonitor) {
     continue;
    }
  var response = performNetworkRequest(website,timeout);
  if(getWebsiteSheetValues()[index][5].toString().toUpperCase() == statusDown && response.responseData.statusCode == 200) {
  log(index, response); 
  allGood(response);
  sendMail(index, response);
  sendToSlack(index, response);
//  Logger.log(res)
  }else if(getWebsiteSheetValues()[index][5].toString().toUpperCase() == statusDown && response.responseData.statusCode != 200){
    notGood(response)
    log(index, response); 
  }else if(response.responseData.statusCode != 200) {
    notGood(response);  
    log(index, response); 
    var res = performNetworkRequest(website,timeout);// Retry logic
    Logger.log(res)
    if(res.responseData.statusCode != 200) {
      sendMail(index, res);
      sendToSlack(index, res);
      }else {
        allGood(res);
        }
      }
      else if(response.responseData.statusCode == 200) {
      log(index, response); 
      allGood(response);
    }
  }
}

function allGood(response){
  getWebsiteSheet().getRange("F" + (index + 1)).setValue(statusUp);
  getWebsiteSheet().getRange("F" + (index + 1)).setBackground("#228B22");
  getWebsiteSheet().getRange("G" + (index + 1)).setValue(response.dateTime);
  getWebsiteSheet().getRange("H" + (index + 1)).setValue(response.responseData.Status);
  getWebsiteSheet().getRange("I" + (index + 1)).setValue(response.responseData.time);

}

function notGood(response){
  getWebsiteSheet().getRange("F" + (index + 1)).setValue(statusDown);
  getWebsiteSheet().getRange("F" + (index + 1)).setBackground("#DC143C");
  getWebsiteSheet().getRange("G" + (index + 1)).setValue(new Date());
  getWebsiteSheet().getRange("H" + (index + 1)).setValue(response.responseData.Status);
  getWebsiteSheet().getRange("I" + (index + 1)).setValue(response.responseData.time);

}

// This function send the notification to slack
function sendToSlack(number, response) {
  var status = "UP";
  if(response.responseData.statusCode == 200) {
    status = "UP";
  } else {
    status = "DOWN";
  }
  var message = "*" + getWebsiteSheetValues()[number][0].toString() + "* is " + status + "\nWebsite:" + getWebsiteSheetValues()[number][1].toString() + "\nResponse Code: " + response.responseData.statusCode + "\nTime: " + Utilities.formatDate(response.dateTime, "IST", "dd MMM, yyyy 'at' hh:mm:ss a");
  var payload = { 
    "text": message,
    "username":"vNMonitor Bot",
    "icon_emoji": response.responseData.statusCode != 200 ? ":warning:" : ":white_check_mark:"
  };
  var options = {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : JSON.stringify(payload)
  };
  UrlFetchApp.fetch(uptimeSlackChannelWebhookUrl, options);
}

// This function will send email
function sendMail(number, response) { 
  var status = "UP";
  if(response.responseData.statusCode == 200) {
    status = "UP";
  } else {
    status = "DOWN";
  }
  var emails = getWebsiteSheetValues()[number][2].toString();
  if(!emails) {
   return; 
  }
  var subject =  status + " - " + getWebsiteSheetValues()[number][0].toString();
  //var subject = "[vNative MONITORING ALERT] " + getWebsiteSheetValues()[number][1].toString() + " is " + status;
  var body = "Website: " + getWebsiteSheetValues()[number][0].toString() + "\nStatus: " + status + "\nWebsite:" + getWebsiteSheetValues()[number][1].toString() + "\nResponse Code: " + response.responseData.statusCode + "\nTime: " + Utilities.formatDate(response.dateTime, "IST", "dd MMM, yyyy 'at' hh:mm:ss a");; 
  MailApp.sendEmail(emails, replyToEmail, subject, body);
}



function performNetworkRequest(url,timeout){
  // Make a POST request with a JSON payload.
  var data = {
    'url': url,
    'muteHttpExceptions': true,
    'timeout': timeout
  };
  var requestOptions = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(data)
  };
  //  Logger.log(UrlFetchApp.fetch('https://webcheck.vnative.co', options));
    var response = UrlFetchApp.fetch('https://webcheck.vnative.co', requestOptions);
    var data = {
      "Code": response.getResponseCode(),
      "responseData": JSON.parse(response),
      "dateTime": new Date()
    };
    return data;
  };
  
// This function will log the data in Sheet [0], [1]
function log(number, response) {
  var status = "UP";
  if(response.responseData.statusCode == 200) {
    status = "UP";
  } else {
    status = "DOWN";
  }
  getLogSheet().appendRow([getWebsiteSheetValues()[number][1], response.dateTime, status, response.responseData,response.Code]);
  clearLog();
}

//This function will clear excessive logs 
function clearLog(){
  var logs = getLogSheetValues();
  if (logs.length>36){
    getLogSheet().deleteRows(2,10);
  }
  
}

  
//This function returns the current SpreadSheet
function getActiveSpreadSheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

// These function(s) return(s) Websites and Logs sheets
function getWebsiteSheet() {
  return getActiveSpreadSheet().getSheets()[0];
}

function getLogSheet() {
  return getActiveSpreadSheet().getSheets()[1];
}

// These function(s) return(s) Website and Log sheets values as Object[][]
function getWebsiteSheetValues() {
  return getWebsiteSheet().getDataRange().getValues();  
}

function getLogSheetValues() {
  return getLogSheet().getDataRange().getValues();
}