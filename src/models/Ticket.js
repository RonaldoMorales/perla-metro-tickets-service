const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ticketSchema = new mongoose.Schema({
  // Unique UUID V4 ID 
  _id: {
    type: String,
    default: uuidv4
  },
  
  // Passenger ID (reference to User)
  userId: {
    type: String,
    required: [true, 'El ID del usuario es requerido'],
    index: true // Index for fast queries
  },
  
  // Ticket type: ida or vuelta
  ticketType: {
    type: String,
    enum: {
      values: ['ida', 'vuelta'],
      message: 'El tipo de ticket debe ser "ida" o "vuelta"'
    },
    required: [true, 'El tipo de ticket es requerido']
  },
  
  // Ticket status
  status: {
    type: String,
    enum: {
      values: ['activo', 'usado', 'caducado'],
      message: 'El estado debe ser "activo", "usado" o "caducado"'
    },
    default: 'activo'
  },
  
  // Amount paid
  amount: {
    type: Number,
    required: [true, 'El monto es requerido'],
    min: [0, 'El monto no puede ser negativo'],
    validate: {
      validator: Number.isFinite,
      message: 'El monto debe ser un número válido'
    }
  },
  
  // For soft delete 
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  // Schema options
  timestamps: true, // Automatically adds createdAt and updatedAt
  versionKey: false, // Removes __v
  collection: 'tickets' // Explicit collection name
});

// Composite index to prevent duplicate tickets 
ticketSchema.index(
  { 
    userId: 1, 
    createdAt: 1 
  }, 
  { 
    unique: true,
    partialFilterExpression: { isActive: true },
    name: 'unique_user_daily_ticket'
  }
);

// Middleware to validate duplicates by date
ticketSchema.pre('save', async function(next) {
  if (this.isNew) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const existingTicket = await this.constructor.findOne({
      userId: this.userId,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      isActive: true,
      _id: { $ne: this._id }
    });
    
    if (existingTicket) {
      const error = new Error('Ya existe un ticket activo para este usuario en la fecha actual');
      error.code = 11000; // Error code for duplicates
      return next(error);
    }
  }
  next();
});

// Static method to find active tickets
ticketSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Instance method for soft delete
ticketSchema.methods.softDelete = function() {
  this.isActive = false;
  return this.save();
};

module.exports = mongoose.model('Ticket', ticketSchema);