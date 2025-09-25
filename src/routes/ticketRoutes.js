const express = require('express');
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket
} = require('../controllers/ticketController');

// POST /api/tickets - Create new ticket
router.post('/', createTicket);

// GET /api/tickets - Get all tickets (Admin only)
router.get('/', getAllTickets);

// GET /api/tickets/:id - Get ticket by ID
router.get('/:id', getTicketById);

// PUT /api/tickets/:id - Update ticket
router.put('/:id', updateTicket);

// DELETE /api/tickets/:id - Delete ticket (soft delete)
router.delete('/:id', deleteTicket);

module.exports = router;