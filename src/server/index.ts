import express = require('express');
const app = express();
import fs = require('fs');
import bodyParser = require('body-parser');
import path from 'path';

import {testLogic} from './support/index';

app.use(express.static('Client'));
app.use(bodyParser.json());


app.post('/', async (req,res)=>{
    let { url }  = req.body.streamInformation;
    console.log('Received request to analize with url: ', url);
    try{
        if(url){
            let data = await testLogic(url);
            res.send({data});
        }else{
            new Error('Theres not a valid url');
            res.send({});
        }
    }catch (err){
        console.warn('Error analizing url', err);
        res.send({});
    }
});




// app.get('/', function (req, res) {
//     res.sendFile(path.resolve('Client/index.html'));
// });



var server = app.listen(8080, function () {
    var info:any = server.address();
    console.log("server listening at: ", info.address, info.port)
})