'use strict';

/** Local imports (files found in this project) */
const events = require('./events.js');
require('./driver.js');
require('./vendor.js');


/**
 * Logs a timestamp of a given event and payload
 * @param {*} event 
 * @param {*} payload 
 */
function logger(event, payload) {
  let time = new Date();
  console.log("EVENT", {event, time, payload});
};


/**
 * Listening to events that are being emitted in our Event Pool:
 * 'order-ready' - Vendor will emit this event when an order is ready
 * 'in-transit' - Driver will emit this when he picks up an order
 * 'order-delivered' - Driver will emit this when he has delivered the package
 */
events.on('order-ready', payload => logger('order-ready', payload));
events.on('in-transit', payload => logger('in-transit', payload));
events.on('order-delivered', payload => logger('order-delivered', payload));