var socket = io.connect('http://socketio.gs:9090', { 'forceNew': true });

socket.on('messages', function(data) {
    render(data);
});

socket.on('message', function (data) {
    console.log(data);
});

function render(data) {
    var html = data.map(function(elem, index){
        return(`<div>
            <strong>${elem.author}</strong>:
            <em>${elem.message}</em>
        </div>`)
    }).join(" ");

    document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {
    var mensaje = {
        author: document.getElementById('username').value,
        message: document.getElementById('texto').value
    };
    socket.emit('new-message', mensaje);

    return false;
}

function addConectarPrivado(e) {
    var channel = document.getElementById('cont_username').value + "-" +document.getElementById('cont_userpriv').value;
    socket.emit('subscribe', channel);



    return false;
}

function addMessagePrivado(e) {
    var mensaje = {
        room: document.getElementById('priv_username').value + "-" +document.getElementById('priv_userpriv').value,
        message: document.getElementById('priv_texto').value
    };

    socket.emit('send', mensaje);
    return false;
}


