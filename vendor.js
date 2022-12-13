'use strict';

/** 3rd Party Imports (Files from NPM) */
require('dotenv').config();
const Chance = require('chance');

/** Local imports (files found in this project) */
const emitter = require('./events.js');

// Chance documentation to instantiate a new chance class
const chance = new Chance();


/**
 * Listening to events that are being emitted in our Event Pool:
 * 'order-delievered' - Driver will emit this event when he has delivered a package
 */
emitter.on('order-delivered', (payload) => {
    console.log(`VENDOR: Thank you for delivering [${payload.orderId}]`);
});


/**
 * Creates an order payload object
 * @returns { Object } - The order payload object
 */
function generateOrder() {

    let payload = {};

    payload.orderId = chance.integer();
    payload.storeName = process.env.storeName;
    payload.customerName = chance.name();
    payload.address = chance.address();

    return payload;
};

/**
 * A start method to start the Vendor service to emit an event every 5 seconds
 */
function start() {
setInterval(() => {
    emitter.emit('order-ready', generateOrder());
}, 5000);
};

start();

module.exports = { start };
