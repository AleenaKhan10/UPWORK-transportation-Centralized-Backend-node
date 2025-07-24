### **Project Overview**
This is a **RingCentral API Integration Server** for a trucking/logistics company that manages driver communications and safety monitoring. The system integrates with RingCentral's telephony services to make automated calls to drivers based on GPS and safety data.

---

## 🏗️ **Architecture Documentation**

### **1. System Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Node.js       │    │   RingCentral   │
│   (Client Apps) │◄──►│   Backend       │◄──►│   API           │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   MySQL         │
                       │   Database      │
                       └─────────────────┘
```

### **2. Technology Stack**

| Component | Technology | Version |
|-----------|------------|---------|
| **Runtime** | Node.js | Latest |
| **Framework** | Express.js | 5.1.0 |
| **Database** | MySQL | via Sequelize 6.37.7 |
| **ORM** | Sequelize | 6.37.7 |
| **Telephony** | RingCentral SDK | 5.0.4 |
| **Scheduling** | node-cron | 4.2.1 |
| **HTTP Client** | Axios | 1.10.0 |

### **3. Project Structure**

```
node_backend/
├── 📁 controllers/          # Business logic layer
│   ├── accountController.js
│   ├── authController.js
│   ├── callController.js    # Core telephony logic
│   ├── driverController.js
│   ├── driverReportsController.js
│   ├── pcmilerController.js
│   └── vapiAgentController.js
├── 📁 routes/              # API endpoint definitions
│   ├── account.js
│   ├── auth.js
│   ├── calls.js           # Telephony endpoints
│   ├── drivers.js
│   ├── pcmiler.js
│   └── reports.js
├── 📁 models/              # Database models
│   ├── Driver.js          # Driver entity
│   └── DriverReport.js    # GPS/Safety reports
├── 📁 database/            # Database configuration
│   └── dbConnection.js    # Sequelize setup
├── 📁 utils/              # Shared utilities
│   ├── ringcentral.js    # RingCentral SDK setup
│   ├── tokenManager.js   # Auth token management
│   └── poll.js          # Call status polling
├── �� cron/              # Scheduled tasks
│   └── callScheduler.js  # Daily 7AM driver calls
├── �� storage/           # File storage
│   └── token.json       # Auth tokens
├── server.js             # Application entry point
└── package.json          # Dependencies
```

### **4. Core Business Logic**

#### **Driver Management System**
- **Driver Model**: Stores driver information including contact details, preferences, and communication settings
- **Safety Features**: GPS speed monitoring, safety calls, maintenance alerts
- **Communication Preferences**: Per-driver settings for different types of calls/messages

#### **Automated Calling System**
- **RingOut API**: Makes outbound calls through RingCentral
- **Batch Processing**: Automated calls to multiple drivers based on safety criteria
- **Status Polling**: Real-time call status monitoring
- **Scheduled Tasks**: Daily 7AM safety calls to drivers

#### **Safety Monitoring**
- **GPS Speed Tracking**: Monitors driver speed (>5 mph triggers calls)
- **Status Filtering**: Processes reports with specific sub-status codes (1, 3, 5)
- **Real-time Alerts**: Immediate response to safety violations

### **5. API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/auth/*` | Authentication routes |
| `POST` | `/api/make-call` | Make single call |
| `GET` | `/api/drivers-call` | Batch call to drivers |
| `POST` | `/api/transfer-call` | Transfer active call |
| `GET` | `/api/active-calls` | List active calls |
| `GET` | `/api/recent-calls` | List recent calls |
| `GET` | `/api/recordings` | Get call recordings |
| `GET` | `/api/drivers/*` | Driver management |
| `GET` | `/api/reports/*` | Driver reports |
| `GET` | `/api/pcmiler/*` | PCMiler integration |

### **6. Data Models**

#### **Driver Model**
```javascript
{
  driverId: String (Primary Key),
  status: String,
  firstName: String,
  lastName: String,
  truckId: String,
  phoneNumber: String,
  email: String,
  companyId: String,
  dispatcher: String,
  // Communication preferences
  globalDnd: Boolean,
  safetyCall: Boolean,
  safetyMessage: Boolean,
  hosSupport: Boolean,
  maintainanceCall: Boolean,
  maintainanceMessage: Boolean,
  dispatchCall: Boolean,
  dispatchMessage: Boolean,
  accountCall: Boolean,
  accountMessage: Boolean,
  telegramId: String
}
```

#### **DriverReport Model**
- GPS coordinates and speed data
- Safety status codes
- Timestamp information

### **7. Key Features**

#### **🔔 Automated Safety System**
- **Daily 7AM Calls**: Automated safety check calls to drivers
- **Speed Monitoring**: GPS-based speed violation detection
- **Status Filtering**: Intelligent report processing

#### **📞 RingCentral Integration**
- **RingOut API**: Outbound calling capabilities
- **Token Management**: Automatic token refresh
- **Call Status Polling**: Real-time call monitoring
- **Call Transfer**: Advanced call routing

#### **🔄 Scheduled Operations**
- **Cron Jobs**: Daily automated processes
- **Batch Processing**: Multi-driver call operations
- **Error Handling**: Robust error management

### **8. Environment Configuration**

Required environment variables:
```env
# Database
NODE_DATABASE_NAME=
NODE_DATABASE_USER=
NODE_DATABASE_PASSWORD=
NODE_DATABASE_HOST=

# RingCentral
RC_CLIENT_ID=
RC_CLIENT_SECRET=
RC_SERVER=

# Server
PORT=8000
```

### **9. Deployment & Scaling**

#### **Current Setup**
- Single Node.js instance
- MySQL database
- File-based token storage
- Basic error handling

#### **Recommended Improvements**
1. **Token Storage**: Move to Redis for distributed token management
2. **Load Balancing**: Add multiple Node.js instances
3. **Database**: Implement connection pooling
4. **Monitoring**: Add health checks and metrics
5. **Logging**: Implement structured logging
6. **Security**: Add rate limiting and input validation
