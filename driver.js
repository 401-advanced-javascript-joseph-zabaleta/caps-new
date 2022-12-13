'use strict';

/** Local imports (files found in this project) */
const emitter = require('./events.js');


/**
 * Listening to events that are being emitted in our Event Pool:
 * 'order-ready' - Vendor will emit this event when an order is ready
 * 'in-transit' - Driver will emit this when he picks up an order
 */
emitter.on('order-ready', handleOrder);
emitter.on('in-transit', finishOrder);


/**
 * Handles the pickup of an order and emits 'in-transit' event with the given payload
 * @callback - Used for the 'order-ready' event listener
 * @param { Object } payload 
 */
function handleOrder(payload) {
    setTimeout(() => {
        console.log(payload);
        console.log(`DRIVER: picked up [${payload.orderId}]`);
        emitter.emit('in-transit', payload);
    }, 1000);
};

/**
 * Handles the delivering of an order and emits 'order-delivered' event with the given payload
 * @callback - Used for the 'in-transit' event listener
 * @param { Object } payload 
 */
function finishOrder(payload) {
    setTimeout(() => {
        console.log(`DRIVER: delivered [${payload.orderId}]`);
        emitter.emit('order-delivered', payload);
    }, 3000);
}
