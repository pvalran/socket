const cors = require('cors');
const bodyParser   = require('body-parser');
const express = require('express');
const app = express();
const socket = require('socket.io');

/*
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const app = express();
const server = https.createServer({
    key: fs.readFileSync('/home/prangel/key.pem'),
    cert: fs.readFileSync('/home/prangel/cert.pem'),
    passphrase: 'Cdmxdev19'
},app);
const io = require('socket.io')(server);
*/

const messages =  [{
    author: 'Carlos',
    message: 'Hola que tal?'
},{
    author: 'Pepe',
    message: 'Muy bien'
},{
    author: 'Paco',
    message: 'Genial'
}];

var point_taxi_drive = {
    taxiDriver: 125478,
    latitude:19.33372,
    longitude:-99.161356
};



var point_taxi_drivers = [{
    taxiDriver:125478,
    latitude:19.3329699,
    longitude:-99.1488786
},{
    taxiDriver:758426,
    latitude:19.3615767,
    longitude:-99.1565977
},{
    taxiDriver:125478,
    latitude:19.3414625,
    longitude:-99.1329778
}];

/*app.use(function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","POST, GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials","true");
    next();
});*/

app.use(cors());
app.use(express.static('public'));
app.options('*', cors());

app.post('/send/:room/', function(req, res) {
    var room = req.params.room
    var message = req.body;

    io.sockets.in(room).emit('message', { room: room, message: message });

    res.end('message sent');
});


const server = app.listen(9090,function() { console.log('Servidor socket de TaxiApp');});
const io = socket(server);

io.set('origins','*:*');
io.on('connection',(socket) => {
    console.log("un cliente se ha conectado");
    socket.emit('messages',messages);
    socket.emit('taxi_drive',point_taxi_drive);
    socket.emit('taxi_drivers',point_taxi_drivers);

    socket.on('new-message', function(data) {
        messages.push(data);
        io.socket.emit('messages', messages);
    });

    socket.on('subscribe', function(room) {
        console.log('joining room', room);
        socket.join(room);
        io.socket.in(room).emit('message', 'joining room'+room);
    })

    socket.on('unsubscribe', function(room) {
        console.log('leaving room', room);
        socket.leave(room);
    })

    socket.on('send', function(data) {
        console.log('sending message'+data.room);
        io.socket.in(data.room).emit('message', data);
    });

    socket.on('send-driver',function(data){
        console.log('Datos drivers' + JSON.stringify(data));
        point_taxi_drive = data;
        io.sockets.emit('taxi_drive',point_taxi_drive);
    });
});
