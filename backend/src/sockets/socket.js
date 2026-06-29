/**
 * Socket.IO Initialization — Placeholder
 *
 * This module will house the Socket.IO server instance and all real-time
 * event registration logic for the NiT Admin system.
 *
 * ─── PLANNED EVENTS (from BACKEND_INTEGRATION.md) ────────────────────────────
 * Client → Server:
 *   • subscribe:live-feed          — subscribe to real-time attendance events
 *   • unsubscribe:live-feed        — unsubscribe from live feed
 *   • subscribe:device-status      — subscribe to device health updates
 *
 * Server → Client:
 *   • attendance:new-event         — new biometric scan event
 *   • device:status-change         — device online/offline state change
 *   • device:alert                 — device health alert
 *   • attendance:summary-update    — live KPI counter update
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ─── HOW TO ACTIVATE ─────────────────────────────────────────────────────────
 * When ready to integrate, import and call `initSocket(server)` in server.js
 * AFTER the HTTP server has started:
 *
 *   import { initSocket } from './sockets/socket.js';
 *   const server = app.listen(PORT, () => { ... });
 *   initSocket(server);
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { Server } from 'socket.io';

/** @type {import('socket.io').Server | null} */
let io = null;

/**
 * Initializes the Socket.IO server attached to the given HTTP server.
 *
 * @param {import('http').Server} httpServer - The Node.js HTTP server instance
 * @returns {import('socket.io').Server} The configured Socket.IO server
 */
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
        : ['http://localhost:5173'],
      methods: ['GET', 'POST'],
    },
  });

  // TODO: Register event namespaces and handlers here in a future phase.
  // Example:
  //   io.on('connection', (socket) => {
  //     socket.on('subscribe:live-feed', () => { ... });
  //   });

  return io;
};

/**
 * Returns the active Socket.IO instance.
 * Call `initSocket` before using this.
 *
 * @returns {import('socket.io').Server | null}
 */
export const getIO = () => io;
