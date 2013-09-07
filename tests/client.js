#!/usr/bin/env node

var util = require('util');
var fs = require('fs');
var fix = require('../fix.js');
var _ = require('underscore');


var sendercompid = "DATA_FIX_TMT";
var targetcompid = "HSFX-FIX-BRIDGE";
var port = 9021;
var host = "209.191.250.26";

if(process.argv.length > 3){
        sendercompid = process.argv[2];
        targetcompid = process.argv[3];
}
if(process.argv.length > 4){
	port = parseInt(process.argv[4]);
}

console.log("FIX client listening on port "+port+" with server "+ targetcompid+" and client id "+sendercompid);

var client = new fix.FIXClient("FIX.4.2",sendercompid,targetcompid,{});
client.init(function(clientx){

    console.log("client initiated:"+_.keys(client));

    client.createConnection({port:port, host:host}, function(session){
        session.on('logon',function(){
            util.log(">>>>>CLIENT-LOGON");
        });
        session.on('msg',function(msg){
            util.log(">>>>>CLIENT:"+JSON.stringify(msg));
        });
        session.on('outmsg',function(msg){
            util.log("<<<<<CLIENT:"+JSON.stringify(msg));
        });
        session.on('msg-resync',function(msg){
            util.log(">>>>>CLIENT-RESYNC:"+JSON.stringify(msg));
        });
        session.on('outmsg-resync',function(msg){
            util.log("<<<<<CLIENT-RESYNC:"+JSON.stringify(msg));
        });
        session.on('error',function(msg){
            util.log(">> >> >>CLIENT:"+JSON.stringify(msg));
        });
        session.on('state',function(msg){
            //util.log("-----CLIENT:"+JSON.stringify(msg));
        });
        session.on('disconnect',function(msg){
            util.log("-------CLIENT:"+JSON.stringify(msg));
        });
        
        session.sendLogon();
    });
    
});

console.log("client exiting");

