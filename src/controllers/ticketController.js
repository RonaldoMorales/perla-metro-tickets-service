const Ticket = require('../models/Ticket');

/**
 * Create a new ticket
 * Validates that no duplicate ticket exists for the same user on the same date
 */
const createTicket = async (req, res) => {
  try {
    const { userId, ticketType, amount } = req.body;

    // Validate required fields
    if (!userId || !ticketType || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos (userId, ticketType, amount)'
      });
    }

    // Validate ticket type
    if (!['ida', 'vuelta'].includes(ticketType)) {
      return res.status(400).json({
        success: false,
        message: 'El tipo de ticket debe ser "ida" o "vuelta"'
      });
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El monto debe ser un número mayor a 0'
      });
    }

    // Check for duplicates on the same date
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const existingTicket = await Ticket.findOne({
      userId,
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay
      },
      isActive: true
    });

    if (existingTicket) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un ticket para este usuario en la fecha actual'
      });
    }

    // Create new ticket
    const ticket = new Ticket({
      userId,
      ticketType,
      amount
    });

    const savedTicket = await ticket.save();

    res.status(201).json({
      success: true,
      message: 'Ticket creado exitosamente',
      data: {
        id: savedTicket._id,
        userId: savedTicket.userId,
        ticketType: savedTicket.ticketType,
        status: savedTicket.status,
        amount: savedTicket.amount,
        createdAt: savedTicket.createdAt,
        updatedAt: savedTicket.updatedAt
      }
    });

  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Get all tickets (Admin only)
 * Returns all active tickets with user information
 */
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findActive()
      .sort({ createdAt: -1 })
      .lean();

    const formattedTickets = tickets.map(ticket => ({
      id: ticket._id,
      userId: ticket.userId, 
      userNamePlaceholder: 'Usuario ' + ticket.userId.slice(-4),
      ticketType: ticket.ticketType,
      status: ticket.status,
      amount: ticket.amount,
      createdAt: ticket.createdAt
    }));

    res.json({
      success: true,
      count: formattedTickets.length,
      data: formattedTickets
    });

  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Get ticket by ID
 * Returns detailed ticket information
 */
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findOne({ _id: id, isActive: true });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        id: ticket._id,
        userId: ticket.userId,
        ticketType: ticket.ticketType,
        amount: ticket.amount,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
    
      }
    });

  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Update ticket
 * Updates ticket data while maintaining data integrity
 */
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ticketType, amount } = req.body;

    // Find ticket
    const ticket = await Ticket.findOne({ _id: id, isActive: true });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    // Validate status transitions
    if (status && !['activo', 'usado', 'caducado'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Debe ser "activo", "usado" o "caducado"'
      });
    }

    // Validate that we cant reactivate expired tickets
    if (ticket.status === 'caducado' && status === 'activo') {
      return res.status(400).json({
        success: false,
        message: 'No se puede reactivar un ticket caducado'
      });
    }

    // Validate ticket type
    if (ticketType && !['ida', 'vuelta'].includes(ticketType)) {
      return res.status(400).json({
        success: false,
        message: 'El tipo de ticket debe ser "ida" o "vuelta"'
      });
    }

    // Validate amount
    if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'El monto debe ser un número mayor a 0'
      });
    }

    // Update fields
    if (status) ticket.status = status;
    if (ticketType) ticket.ticketType = ticketType;
    if (amount) ticket.amount = amount;

    const updatedTicket = await ticket.save();

    res.json({
      success: true,
      message: 'Ticket actualizado exitosamente',
      data: {
        id: updatedTicket._id,
        userId: updatedTicket.userId,
        ticketType: updatedTicket.ticketType,
        status: updatedTicket.status,
        amount: updatedTicket.amount,
        createdAt: updatedTicket.createdAt,
        updatedAt: updatedTicket.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Delete ticket (soft delete)
 * Marks ticket as inactive instead of physically deleting it
 */
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findOne({ _id: id, isActive: true });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    // Perform soft delete
    await ticket.softDelete();

    res.json({
      success: true,
      message: 'Ticket eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket
};