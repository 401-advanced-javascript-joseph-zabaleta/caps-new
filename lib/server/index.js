'use strict';

/** 3rd Party Imports (Files from NPM) */
require('dotenv').config();
const { Server } = require('socket.io');

// Local variables from .env or default value
const PORT = process.env.PORT || 3002;
const STORENAME = process.env.STORENAME || 'Default Store';

/**
 * Creating a new instance of a 'Listening Event Server' at http://localhost:<PORT NUMBER>
 * Creating a namespace for our project
 * - namespace: caps
 * - http://localhost:<PORT>/caps
 */
const server = new Server(PORT);
const capsServer = server.of('/caps')

/**
 * Helper function that Logs a timestamp of a given event
 * @param { Object } body 
 */
function logger(body) {
  let event = body.event;
  let time = new Date();
  let payload = body.payload;

  console.log("EVENT", {event, time, payload});
};


/**
 * Connects server and clients together on caps namespace
 * - Listens to all client events and logs the event
 * - Redirects / emits events out to clients
 */
capsServer.on('connection', (socket) => {

  console.log(`Connection Established on 'caps' namespace: Socket[${socket.id}]`);

  /** 
   * This will create a room / join a room for a socket connecting to the server   
   */
  socket.on('join', (room) => {
    console.log(`You just joined the ${room} room`)
    socket.join(room);
  });

  /**
   * This part will notify clients that they have connected to the HUB and can begin work
   * (Used in Vendor to start building orders)
   */
  socket.emit('confirmation', 'confirmation');

  /**
   * Listening to events that are being emitted in our socket server
   * 'order-ready' - Vendor will emit this event when an order is ready
   * 'in-transit' - Driver will emit this when he picks up an order
   * 'order-delivered' - Driver will emit this when he has delivered the package
   */
  socket.on('order-ready', (payload) => {
    logger(payload);
    capsServer.emit('order-ready', payload);
  });

  socket.on('in-transit', (payload) => {
      logger(payload);
      capsServer.to(STORENAME).emit('in-transit', payload);
  });

  socket.on('order-delivered', (payload) => {
      logger(payload);
      capsServer.to(STORENAME).emit('order-delivered', payload);
  });

})

