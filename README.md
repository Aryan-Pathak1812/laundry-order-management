# 🧺 Laundry Order Management System (AI-First)

A lightweight, easy-to-use laundry order management system built with Node.js and Express. This project demonstrates heavy use of AI tools (ChatGPT, GitHub Copilot) for rapid development.

**Status**: ✅ MVP Complete | **Build Time**: ~4 hours with AI assistance

---

## 📋 Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Setup Instructions](#setup-instructions)
4. [API Endpoints](#api-endpoints)
5. [Usage Examples](#usage-examples)
6. [AI Usage Report](#ai-usage-report)
7. [Tradeoffs & Future Improvements](#tradeoffs--future-improvements)

---

## ✨ Features Implemented

### ✅ Core Features
- **Create Orders**: Add new orders with customer details, garments, and quantities
- **Order Status Management**: Track orders through RECEIVED → PROCESSING → READY → DELIVERED
- **View Orders**: List all orders with filtering by status, customer name, or phone
- **Dashboard Analytics**: View total orders, revenue, and orders by status
- **Garment Pricing**: Hardcoded pricing for 10+ garment types

### ✅ Technical Features
- **RESTful API**: Clean, documented endpoints
- **Input Validation**: Phone number, customer name, garment type validation
- **Error Handling**: Comprehensive error messages
- **In-Memory Database**: Fast storage (can migrate to MongoDB/PostgreSQL)
- **CORS Enabled**: Ready for frontend integration
- **Unique Order IDs**: UUID-based order identification

### ✅ Garments Supported
```
Shirt: ₹150  |  Pants: ₹200  |  Saree: ₹300  |  Kurta: ₹250
Dupatta: ₹100  |  Jacket: ₹350  |  Coat: ₹400  |  Jeans: ₹200
Skirt: ₹180  |  Dress: ₹250
```

---

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: In-Memory (JavaScript Object)
- **ID Generation**: UUID
- **HTTP Client**: Any (curl, Postman, Insomnia)
- **Port**: 5000 (configurable via .env)

**Why this stack?**
- Minimal setup time
- Easy to understand and debug
- Quick to migrate to proper DB
- Perfect for 72-hour MVP challenge

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v14+ and npm installed
- Git (for cloning)

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/Aryan-Pathak1812/laundry-order-management.git
cd laundry-order-management

# 2. Install dependencies
npm install

# 3. Create .env file (optional, has defaults)
cp .env.example .env

# 4. Start the server
npm start
# OR for development with auto-reload
npm run dev

# 5. Test the API
curl http://localhost:5000/api/health
```

**Expected Output:**
```json
{
  "status": "Server is running",
  "timestamp": "2026-04-15T10:30:00.000Z"
}
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### 1. **Create Order** ➕
```
POST /orders
Content-Type: application/json

Request Body:
{
  "customerName": "Raj Kumar",
  "phoneNumber": "9876543210",
  "garments": [
    { "type": "Shirt", "quantity": 2 },
    { "type": "Pants", "quantity": 1 }
  ]
}

Response (201):
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "orderId": "A1B2C3D4",
    "customerName": "Raj Kumar",
    "phoneNumber": "9876543210",
    "garments": [
      { "type": "Shirt", "quantity": 2 },
      { "type": "Pants", "quantity": 1 }
    ],
    "status": "RECEIVED",
    "totalBill": 500,
    "createdAt": "2026-04-15T10:00:00.000Z",
    "updatedAt": "2026-04-15T10:00:00.000Z"
  }
}
```

### 2. **Get All Orders** 📋
```
GET /orders
GET /orders?status=READY
GET /orders?customerName=Raj
GET /orders?phoneNumber=9876543210

Response (200):
{
  "success": true,
  "count": 2,
  "orders": [
    { ...order1 },
    { ...order2 }
  ],
  "filters": { "status": null, "customerName": null, "phoneNumber": null }
}
```

### 3. **Get Order by ID** 🔍
```
GET /orders/:orderId

Example: GET /orders/A1B2C3D4

Response (200):
{
  "success": true,
  "order": { ...order }
}
```

### 4. **Update Order Status** 🔄
```
PATCH /orders/:orderId/status
Content-Type: application/json

Request Body:
{
  "status": "PROCESSING"
}

Valid Statuses: RECEIVED, PROCESSING, READY, DELIVERED

Response (200):
{
  "success": true,
  "message": "Order status updated successfully",
  "order": { ...order }
}
```

### 5. **Delete Order** 🗑️
```
DELETE /orders/:orderId

Response (200):
{
  "success": true,
  "message": "Order deleted successfully"
}
```

### 6. **Get Garments & Pricing** 💰
```
GET /orders/config/garments

Response (200):
{
  "success": true,
  "garments": {
    "Shirt": 150,
    "Pants": 200,
    ...
  },
  "availableStatuses": {
    "RECEIVED": "RECEIVED",
    ...
  }
}
```

### 7. **Dashboard - Statistics** 📊
```
GET /dashboard

Response (200):
{
  "success": true,
  "dashboard": {
    "totalOrders": 5,
    "totalRevenue": 2500,
    "ordersByStatus": {
      "RECEIVED": 2,
      "PROCESSING": 1,
      "READY": 1,
      "DELIVERED": 1
    },
    "averageOrderValue": "500.00"
  },
  "timestamp": "2026-04-15T10:30:00.000Z"
}
```

### 8. **Dashboard - Detailed Analytics** 📈
```
GET /dashboard/analytics

Response (200):
{
  "success": true,
  "analytics": {
    "totalOrders": 5,
    "totalRevenue": 2500,
    "ordersByStatus": {
      "RECEIVED": { "count": 2, "revenue": 800 },
      ...
    },
    "topCustomers": {
      "Raj Kumar": { "orders": 3, "spent": 1200 },
      ...
    }
  }
}
```

### 9. **Health Check** ❤️
```
GET /health

Response (200):
{
  "status": "Server is running",
  "timestamp": "2026-04-15T10:30:00.000Z"
}
```

---

## 💡 Usage Examples

### Example 1: Create Order via curl
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Priya Singh",
    "phoneNumber": "9876543210",
    "garments": [
      { "type": "Saree", "quantity": 1 },
      { "type": "Dupatta", "quantity": 2 }
    ]
  }'
```

### Example 2: Get Orders by Status
```bash
curl http://localhost:5000/api/orders?status=READY
```

### Example 3: Update Order Status
```bash
curl -X PATCH http://localhost:5000/api/orders/A1B2C3D4/status \
  -H "Content-Type: application/json" \
  -d '{ "status": "DELIVERED" }'
```

### Example 3: Get Dashboard
```bash
curl http://localhost:5000/api/dashboard
```

---

## 🤖 AI Usage Report

### Tools Used
1. **GitHub Copilot** - Code generation and debugging
2. **ChatGPT-4** - Architecture design and documentation

---

### Prompts Used

#### Prompt 1: Project Structure
**User Query:**
```
"I need to build a laundry order management system in Node.js with Express. 
It needs to:
- Create orders with customer name, phone, garments list
- Update order status (RECEIVED -> PROCESSING -> READY -> DELIVERED)
- View orders with filters by status, name, phone
- Dashboard with total orders, revenue, orders by status
- Use in-memory storage for now
Suggest a clean project structure."
```

**AI Response:** ✅ Suggested MVC pattern with models, routes, and middleware
**What I Used:** Yes, adopted the suggested structure

---

#### Prompt 2: Order Model
**User Query:**
```
"Create a JavaScript Order class with:
- Constructor taking customerName, phoneNumber, garments array
- Auto-generate unique order ID
- Calculate total bill from garment prices
- updateStatus method with validation
- toJSON method"
```

**AI Response:** ✅ Complete, production-ready Order class
**What I Used:** 95% - only tweaked error messages

---

#### Prompt 3: Express Routes
**User Query:**
```
"Create Express POST route to create orders with validation:
- Customer name required (string)
- Phone number required (10 digits)
- Garments array required (not empty)
- Validate each garment type against predefined list
- Return order with total bill or error"
```

**AI Response:** ✅ Comprehensive validation middleware
**What I Used:** 90% - improved error messages and status codes

---

#### Prompt 4: Dashboard Endpoints
**User Query:**
```
"Create two dashboard endpoints:
1. /dashboard - return total orders, total revenue, count by status
2. /dashboard/analytics - include top 5 customers by spending
Handle edge cases where no orders exist"
```

**AI Response:** ✅ Full analytics logic with sorting
**What I Used:** 100% - exactly what was needed

---

#### Prompt 5: README Documentation
**User Query:**
```
"Create a comprehensive README with:
- Setup instructions
- All API endpoints with examples
- Usage examples with curl
- Explain the architecture
- Be beginner-friendly"
```

**AI Response:** ✅ Well-structured README
**What I Used:** 85% - expanded with specific examples for laundry business

---

### Where AI Helped Most
1. ✅ **Project Structure** - Suggested clean MVC pattern
2. ✅ **Validation Logic** - Complex error handling for phone numbers and garments
3. ✅ **Route Design** - RESTful endpoint design patterns
4. ✅ **Error Handling** - Middleware for centralized error management
5. ✅ **Documentation** - Professional README template

---

### What AI Got Wrong / Needed Fixing

#### Issue 1: Route Conflict
**AI Generated:**
```javascript
router.get('/config/garments')  // Generated at /api/orders/config/garments
```
**Problem:** Would conflict with `GET /orders/:orderId` route
**Fix:** Moved to specific endpoint with proper ordering

#### Issue 2: Status Validation
**AI Generated:**
```javascript
// Directly comparing string to enum
if (status !== ORDER_STATUSES.RECEIVED) { }
```
**Problem:** Fragile for future status additions
**Fix:** Used `Object.values()` to make it dynamic:
```javascript
if (!Object.values(ORDER_STATUSES).includes(newStatus)) { }
```

#### Issue 3: Database Query Performance
**AI Generated:**
```javascript
// Simple filter without optimization
orders.filter(order => order.status === status)
```
**Problem:** Could be slow with thousands of orders
**Fix:** Would add indexed queries if scaling (noted in future improvements)

#### Issue 4: Phone Number Regex
**AI Generated:**
```javascript
/^\d{10}$/  // Too strict for international numbers
```
**Decision:** Kept it for this MVP but noted as limitation

---

### AI Code Quality Assessment

| Aspect | Rating | Notes |
|--------|--------|-------|
| Logic Correctness | ⭐⭐⭐⭐⭐ | 100% working |
| Error Handling | ⭐⭐⭐⭐ | Good, needed minor improvements |
| Code Style | ⭐⭐⭐⭐ | Consistent and clean |
| Documentation | ⭐⭐⭐⭐⭐ | Excellent suggestions |
| Security | ⭐⭐⭐ | Basic validation, no auth needed for MVP |

---

## 📦 Tradeoffs & Future Improvements

### What Was Skipped (Why)
| Feature | Reason | Impact |
|---------|--------|--------|
| **Database (MongoDB/PostgreSQL)** | In-memory sufficient for MVP, easy to migrate | Data lost on server restart |
| **Authentication/Authorization** | Out of scope for 72-hour challenge | Anyone can access all orders |
| **Payment Integration** | Complex, not core to MVP | Bill calculated but not charged |
| **Email Notifications** | Would add 2+ hours | Manual follow-ups needed |
| **Frontend UI** | Focus on backend API | Requires separate React/Vue project |
| **Unit Tests** | Time constraint | But API is well-structured for testing |
| **Docker Setup** | Not essential for MVP | Requires Docker installation |
| **Rate Limiting** | Nice-to-have, not critical | Server vulnerable to abuse |

### Future Improvements (If 2x Time)
1. **Database**: Migrate to MongoDB with Mongoose ODM
2. **Authentication**: Add JWT-based auth for role-based access
3. **Notifications**: Integrate Twilio for SMS updates or Nodemailer for email
4. **Frontend**: Build React dashboard with order creation form
5. **Testing**: Add Jest unit tests (target 80%+ coverage)
6. **API Documentation**: Add Swagger/OpenAPI documentation
7. **Pagination**: Add pagination to list endpoints for large datasets
8. **Soft Deletes**: Instead of hard deletes, mark orders as archived
9. **Order History**: Track status changes with timestamps
10. **Docker**: Create Dockerfile for easy deployment

---

## 🧪 Testing the API

### Quick Test Sequence

```bash
# 1. Check server health
curl http://localhost:5000/api/health

# 2. Create an order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "phoneNumber": "9876543210",
    "garments": [{"type": "Shirt", "quantity": 1}]
  }'

# 3. Get all orders
curl http://localhost:5000/api/orders

# 4. Update status (replace A1B2C3D4 with actual order ID)
curl -X PATCH http://localhost:5000/api/orders/A1B2C3D4/status \
  -H "Content-Type: application/json" \
  -d '{"status": "PROCESSING"}'

# 5. View dashboard
curl http://localhost:5000/api/dashboard
```

---

## 📚 Project Structure

```
laundry-order-management/
├── index.js                 # Main server file
├── package.json             # Dependencies
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── README.md               # This file
├── models/
│   └── Order.js            # Order model with DB logic
└── routes/
    ├── orders.js           # Order CRUD endpoints
    └── dashboard.js        # Dashboard analytics endpoints
```

---

## 🔒 Security Notes

- **No Authentication**: MVP version, add JWT for production
- **Input Validation**: Phone number and garment types validated
- **CORS Enabled**: For frontend integration
- **Error Messages**: Don't leak sensitive info
- **SQL Injection**: N/A (no SQL database in MVP)

---

## 📝 License

ISC License - Feel free to use this project

---

## 👤 Author

**Aryan Pathak**
- GitHub: [@Aryan-Pathak1812](https://github.com/Aryan-Pathak1812)
- Built with ❤️ and AI assistance in 72 hours

---

## 📞 Support

For questions or issues:
1. Check the API Endpoints section
2. Review example curl commands
3. Check server logs for detailed errors

---

**Last Updated**: 2026-04-15
**Version**: 1.0.0
