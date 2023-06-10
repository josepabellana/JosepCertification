import express = require('express');
const app = express();
import fs = require('fs');
import bodyParser = require('body-parser');
import path from 'path';

app.use(express.static('Client'));
app.use(bodyParser.json());


app.post('/', (req,res)=>{
    let {url}  = req.body;

    try{
        if(url){

        }else{
            new Error('Theres not a valid url');
        }
    }catch (err){
        console.warn('Error analizing url', err);
    }
});




// app.get('/', function (req, res) {
//     res.sendFile(path.resolve('Client/index.html'));
// });



var server = app.listen(8080, function () {
    var info:any = server.address();
    console.log("server listening at: ", info.address, info.port)
})