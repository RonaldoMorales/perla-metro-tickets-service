const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const Ticket = require('../models/Ticket');
const connectDB = require('../config/database');

// Sample ticket data 
const sampleTickets = [
  {
    userId: "a1b2c3d4-e5f6-4789-a123-456789abcdef",
    ticketType: "ida",
    amount: 1500,
    status: "activo"
  },
  {
    userId: "b2c3d4e5-f6a7-4890-b234-567890bcdef1", 
    ticketType: "vuelta",
    amount: 1500,
    status: "usado"
  },
  {
    userId: "c3d4e5f6-a789-4901-c345-678901cdef12",
    ticketType: "ida", 
    amount: 2000,
    status: "activo"
  },
  {
    userId: "d4e5f6a7-8901-4012-d456-789012def123",
    ticketType: "vuelta",
    amount: 1800,
    status: "caducado"
  },
  {
    userId: "e5f6a789-0123-4123-e567-890123ef1234",
    ticketType: "ida",
    amount: 1500,
    status: "activo"
  }
];

// Function to create sample tickets with different dates
const createTicketsWithDates = () => {
  const today = new Date();
  const tickets = [];

  sampleTickets.forEach((ticketData, index) => {
    // Create tickets on different days to avoid duplicates
    const ticketDate = new Date(today);
    ticketDate.setDate(today.getDate() - index); 
    
    tickets.push({
      ...ticketData,
      createdAt: ticketDate,
      updatedAt: ticketDate
    });
  });

  return tickets;
};

// Seed function
const seedTickets = async () => {
  try {
    console.log('🌱 Starting tickets seeder...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing tickets 
    await Ticket.deleteMany({});
    console.log('🧹 Cleared existing tickets');
    
    // Create tickets with different dates
    const ticketsToCreate = createTicketsWithDates();
    
    // Insert tickets one by one to handle potential validation errors
    for (let ticketData of ticketsToCreate) {
      try {
        const ticket = new Ticket(ticketData);
        await ticket.save();
        console.log(`✅ Created ticket for user ${ticketData.userId.slice(-4)} - ${ticketData.ticketType}`);
      } catch (error) {
        console.log(`⚠️  Could not create ticket for user ${ticketData.userId.slice(-4)}:`, error.message);
      }
    }
    
    // Show final count
    const totalTickets = await Ticket.countDocuments({ isActive: true });
    console.log(`\n🎫 Total tickets created: ${totalTickets}`);
    
    console.log('\n✅ Seeder completed successfully!');
    
    
  } catch (error) {
    console.error('❌ Error running seeder:', error.message);
  } finally {
    // Close database connection
    mongoose.connection.close();
    console.log('📦 Database connection closed');
  }
};

// Execute seeder if run directly
if (require.main === module) {
  seedTickets();
}

module.exports = { seedTickets, sampleTickets };