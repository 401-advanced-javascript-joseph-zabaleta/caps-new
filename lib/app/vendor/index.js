'use strict';

/** 3rd Party Imports (Files from NPM) */
require('dotenv').config();
const Chance = require('chance');
const { io } = require('socket.io-client');

/** Local variables from .env or default value */
const PORT = process.env.PORT || 3002;
const STORENAME = process.env.STORENAME || 'Default Store';

/** Creates a socket connection to our socket server on the caps namespace */
const socket = io(`http://localhost:${PORT}/caps`);

/** 
 * Chance documentation to instantiate a new chance class 
 * Used to create fake data
 */
const chance = new Chance();

/**
 * Tells our HUB to join a specific room / channel 
 */
socket.emit('join', STORENAME);


/**
 * Listening to events that are being emitted in our socket server
 * 'order-delievered' - Driver will emit this event when he has delivered a package
 *  - NOTE: Driver will emit this event to the server and the server will emit this event to vendoer
 * 'confirmation' - Server emits this event when our vendor successfully connects to the server
*/
socket.on('confirmation', start);

socket.on('order-delivered', (body) => {
    console.log(`VENDOR: Thank you for delivering [${body.payload.orderId}]`);
    process.exit();
})


/**
 * Creates an order payload object
 * @returns { Object } - The order payload object
 */
function generateOrder() {

    let payload = {};

    payload.orderId = chance.integer();
    payload.storeName = STORENAME;
    payload.customerName = chance.name();
    payload.address = chance.address();

    return payload;
};

/**
 * Helper function to build a message object that contains the event type and order (payload)
 * @emits - Emits an 'order-ready' event to the caps namespace socket server
 */
function writeMessage() {

    let message = {};

    message.event = 'order-ready';
    message.payload = generateOrder();

    socket.emit('order-ready', message);
};


/**
 * A start method to start the Vendor service to emit an event every 5 seconds
 */
function start() {
setInterval(writeMessage, 5000);
};


module.exports = { start };
