'use strict';

'use strict';

/** 3rd Party Imports (Files from NPM) */
require('dotenv').config();
const { io } = require('socket.io-client');

/** Local variables from .env or default value */
const PORT = process.env.PORT || 3002;
const STORENAME = process.env.STORENAME || 'Default Store';

/** Creates a socket connection to our socket server on the caps namespace */
const socket = io(`http://localhost:${PORT}/caps`);

/**
 * Listening to events that are being emitted in our socket server
 * 'order-ready' - Vendor will emit this event when an order is ready
 */
socket.on('order-ready', deliverOrder)

/**
 * Helper function used as a callback for when an 'order-ready' event is fired off
 * First an order is picked up and emits an 'in-transit' event
 * Second an order is delivered and emits an 'order-delivered' event
 * @param { Object } body - This is the message object from the event
 */
function deliverOrder(body) {
    setTimeout(() => {
        console.log(`DRIVER: picked up [${body.payload.orderId}]`);
        body.event = 'in-transit';
        socket.emit('in-transit', body);

    }, 1000);

    setTimeout(() => {
        console.log(`DRIVER: delivered [${body.payload.orderId}]`);

        body.event = 'order-delivered';
        socket.emit('order-delivered', body);

    }, 3000);
};