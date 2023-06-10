import express = require('express');
const app = express();
import fs = require('fs');
import bodyParser = require('body-parser');

app.use(express.static(__dirname));
app.use(bodyParser.json());







app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});



var server = app.listen(8080, function () {
    var info:any = server.address();
    console.log("server listening at: ", info.address, info.port)
})