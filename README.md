# Perla Metro - Tickets Service

Microservice for ticket management in Antofagasta's subway transportation system, implemented with distributed SOA architecture.

## 🏗️ Architecture

**SOA (Service-Oriented Architecture)** - Independent service that communicates with other microservices through REST APIs. Each service maintains its own database and specific responsibilities.

## 🎯 Design Pattern

**MVC (Model-View-Controller) adapted for REST APIs:**
- **Models**: Data schemas with Mongoose
- **Controllers**: Business logic and validations
- **Routes**: Endpoints and middlewares

## 🛠️ Technologies

- **Node.js** + **Express.js** - Backend and web server
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **UUID v4** - Unique identifiers
- **Render** - Production deployment

## 📥 Installation and Configuration

```bash
# Clone repository
git clone https://github.com/RonaldoMorales/perla-metro-tickets-service
cd perla-metro-tickets-service

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your actual values

# Required environment variables:
PORT=3002
NODE_ENV=development
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/tickets-db
```

## 🚀 Execution

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start

# Seeder (test data)
npm run seed
```

**URLs:**
- Local: `http://localhost:3002`
- Production: `https://perla-metro-tickets-service.onrender.com/`

## 📚 API Endpoints

**Base URL:** `http://localhost:3002` (local) | `https://perla-metro-tickets-service.onrender.com/` (production)

### Health Check
```http
GET /health
```

### Tickets

#### Create ticket
```http
POST /api/tickets
Content-Type: application/json

{
  "userId": "a1b2c3d4-e5f6-4789-a123-456789abcdef",
  "ticketType": "ida",
  "amount": 1500
}
```

#### List all tickets
```http
GET /api/tickets
```

#### Get specific ticket
```http
GET /api/tickets/f12db3f7-2f99-483e-b71e-54459e3fb605
```

#### Update ticket
```http
PUT /api/tickets/f12db3f7-2f99-483e-b71e-54459e3fb605
Content-Type: application/json

{
  "status": "usado"
}
```

#### Delete ticket (soft delete)
```http
DELETE /api/tickets/f12db3f7-2f99-483e-b71e-54459e3fb605
```

### 🔧 How to test endpoints

#### With Postman:
1. Open Postman
2. Create new request
3. Set method (GET, POST, PUT, DELETE)
4. URL: `http://localhost:3002/api/tickets` for development, `https://perla-metro-tickets-service.onrender.com/` for production
5. For POST/PUT: Body → raw → JSON

## 🔧 Features

- ✅ **Complete CRUD** for tickets
- ✅ **UUID v4** for unique identifiers
- ✅ **Soft delete** for traceability
- ✅ **Duplicate validation** (one ticket per user/day)
- ✅ **Ticket states** (activo, usado, caducado)
- ✅ **Seeder** with test data

## 📁 Structure

```
src/
├── controllers/ticketController.js  # Business logic
├── models/Ticket.js                 # Data schema
├── routes/ticketRoutes.js           # Endpoints
├── config/database.js               # MongoDB configuration
├── seeders/ticketSeeder.js          # Test data
└── app.js                           # Main server
```

## 🤝 Integration

The service is ready for integration with the API Main. The `passengerName` field should be resolved by querying the User Service with the corresponding `userId`.

---
**Developed for Universidad Católica del Norte - SOA Architecture Workshop**
