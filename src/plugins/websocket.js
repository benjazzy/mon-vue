let ws = undefined;
const serverIP = '192.168.1.51';
const port = 8080;
const endpoint = "/send"

let callback = undefined

function initialiseSocket() {
    // const url = networkConnection ?
    //     `http://${networkIP}:${port}` :
    //     `http://${localIP}:${port}`;

    const url = `ws://${serverIP}:${port}${endpoint}`

    ws = new WebSocket(url)

    ws.onclose = function(e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function() {
            initialiseSocket();
        }, 1000);
    };

    if (callback !== undefined) {
        ws.onmessage = callback
    }

    ws.onerror = function(err) {
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        ws.close();
    };
}

export function addEventListener(cb) {
    if (!ws) {
        initialiseSocket();
    }

    ws.onmessage = cb
    callback = cb
    // socket.on(event.type, event.callback);
}

export function sendMessage(message) {
    // socket.emit(event.type, event.data);
    if (ws != undefined) {
        if (ws.readyState === ws.OPEN) {
            ws.send(message)
        }
    }
}

export function isConnected() {
    if (ws !== undefined) {
        return ws.readyState === ws.OPEN;
    }
    else
        return false
}

export function isConnecting() {
    if (ws !== undefined) {
        return ws.readyState === ws.CONNECTING;
    }
    else
        return false
}