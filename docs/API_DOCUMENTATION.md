# 📚 API Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL & Headers](#base-url--headers)
4. [Error Handling](#error-handling)
5. [Endpoints](#endpoints)
6. [Rate Limiting](#rate-limiting)
7. [Testing](#testing)
8. [SDK Examples](#sdk-examples)

---

## 🌐 Overview

The RingCentral Backend API provides telephony services, driver management, and safety monitoring for a trucking/logistics company. The API integrates with RingCentral's telephony platform and manages GPS tracking data for automated safety calls.

### **API Version**: v1.0
### **Base URL**: `http://localhost:8000`
### **Content-Type**: `application/json`

---

## 🔐 Authentication

### **RingCentral OAuth 2.0 Flow**

The API uses RingCentral's OAuth 2.0 authentication. All telephony endpoints require valid authentication.

#### **1. Login Flow**
```bash
# Step 1: Redirect to RingCentral login
GET /auth/login

# Step 2: User authenticates with RingCentral
# Step 3: RingCentral redirects to callback with auth code
GET /auth/callback?code=AUTH_CODE

# Step 4: Token is saved locally
```

#### **2. Environment Variables Required**
```env
RC_CLIENT_ID=your_ringcentral_client_id
RC_CLIENT_SECRET=your_ringcentral_client_secret
RC_SERVER=https://platform.ringcentral.com
RC_REDIRECT_URI=http://localhost:8000/auth/callback
```

#### **3. Token Management**
- Tokens are stored in `storage/token.json`
- Automatic token refresh handled by `utils/tokenManager.js`
- Token validation before each API call

---

## 🌍 Base URL & Headers

### **Base URL**
```
Development: http://localhost:8000
Production:  https://your-domain.com
```

### **Required Headers**
```http
Content-Type: application/json
Accept: application/json
```

### **Authentication Headers** (for protected endpoints)
```http
Authorization: Bearer {ringcentral_token}
```

---

## ⚠️ Error Handling

### **Standard Error Response Format**
```json
{
  "success": false,
  "error": "Error description",
  "status": 500,
  "message": "Human readable message"
}
```

### **HTTP Status Codes**
| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `500` | Internal Server Error |

### **Common Error Scenarios**
```json
// Authentication Error
{
  "error": "Not authenticated with RingCentral",
  "status": 401
}

// Validation Error
{
  "error": "Origin and destination are required.",
  "status": 400
}

// RingCentral API Error
{
  "error": "Failed to calculate ETA.",
  "detail": "API specific error message"
}
```

---

## 📡 Endpoints

### **🔐 Authentication Endpoints**

#### **1. Login**
```http
GET /auth/login
```

**Description**: Initiates RingCentral OAuth flow

**Response**: Redirects to RingCentral login page

**Example**:
```bash
curl -X GET http://localhost:8000/auth/login
```

#### **2. OAuth Callback**
```http
GET /auth/callback?code={auth_code}
```

**Description**: Handles OAuth callback from RingCentral

**Parameters**:
- `code` (string, required): Authorization code from RingCentral

**Response**:
```json
{
  "message": "✅ Login successful. Token saved."
}
```

**Example**:
```bash
curl -X GET "http://localhost:8000/auth/callback?code=AUTH_CODE"
```

#### **3. Logout**
```http
GET /auth/logout
```

**Description**: Revokes RingCentral token and clears local storage

**Response**:
```json
{
  "message": "🚪 Logged out successfully."
}
```

**Example**:
```bash
curl -X GET http://localhost:8000/auth/logout
```

---

### **📞 Telephony Endpoints**

#### **1. Make Single Call**
```http
POST /api/make-call
```

**Description**: Initiates an outbound call using RingOut API

**Request Body**: (Currently hardcoded for testing)
```json
{
  "from": "317-559-2104",
  "to": "(219) 200-2824"
}
```

**Response**:
```json
{
  "message": "Call status result",
  "callId": "123456789",
  "status": "Success",
  "duration": 45
}
```

**Example**:
```bash
curl -X POST http://localhost:8000/api/make-call \
  -H "Content-Type: application/json" \
  -d '{}'
```

#### **2. Batch Call to Drivers**
```http
GET /api/drivers-call
```

**Description**: Makes automated calls to drivers based on safety criteria

**Business Logic**:
- Filters reports with `subStatus` in [1, 3, 5]
- Checks GPS speed > 5 mph
- Matches with driver preferences
- Makes RingCentral calls

**Response**:
```json
{
  "success": true,
  "totalCallsAttempted": 5,
  "callResults": [
    {
      "driverId": "DRIVER123",
      "phoneNumber": "(555) 123-4567",
      "callId": "123456789",
      "status": "Call initiated"
    },
    {
      "driverId": "DRIVER456",
      "phoneNumber": "(555) 987-6543",
      "status": "Call failed",
      "error": "Invalid phone number"
    }
  ]
}
```

**Example**:
```bash
curl -X GET http://localhost:8000/api/drivers-call
```

#### **3. Transfer Call**
```http
POST /api/transfer-call
```

**Description**: Transfers an ongoing call to another number

**Request Body**:
```json
{
  "sessionId": "session_123",
  "partyId": "party_456",
  "targetNumber": "(555) 123-4567"
}
```

**Response**:
```json
{
  "status": "Success",
  "message": "Call transferred successfully"
}
```

**Example**:
```bash
curl -X POST http://localhost:8000/api/transfer-call \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_123",
    "partyId": "party_456",
    "targetNumber": "(555) 123-4567"
  }'
```

#### **4. List Active Calls**
```http
GET /api/active-calls
```

**Description**: Returns currently active calls

**Response**:
```json
{
  "records": [
    {
      "id": "call_123",
      "sessionId": "session_456",
      "from": {
        "phoneNumber": "317-559-2104"
      },
      "to": {
        "phoneNumber": "(555) 123-4567"
      },
      "status": "Connected",
      "startTime": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Example**:
```bash
curl -X GET http://localhost:8000/api/active-calls
```

#### **5. List Recent Calls**
```http
GET /api/recent-calls
```

**Description**: Returns recent call history (last 20 calls)

**Response**:
```json
{
  "records": [
    {
      "id": "call_123",
      "sessionId": "session_456",
      "from": {
        "phoneNumber": "317-559-2104"
      },
      "to": {
        "phoneNumber": "(555) 123-4567"
      },
      "status": "Completed",
      "startTime": "2024-01-15T10:30:00Z",
      "duration": 120
    }
  ]
}
```

**Example**:
```bash
curl -X GET http://localhost:8000/api/recent-calls
```

#### **6. Get Call Recordings**
```http
GET /api/recordings
```

**Description**: Retrieves call recording information

**Response**:
```json
{
  "id": "recording_123",
  "sessionId": "session_456",
  "contentUri": "https://media.ringcentral.com/restapi/v1.0/account/~/recording/123/content",
  "startTime": "2024-01-15T10:30:00Z",
  "duration": 120
}
```

**Example**:
```bash
curl -X GET http://localhost:8000/api/recordings
```

---

### **👥 Driver Management Endpoints**

#### **1. Get All Drivers**
```http
GET /api/drivers
```

**Description**: Retrieves all driver information

**Response**:
```json
{
  "success": true,
  "total": 150,
  "data": [
    {
      "driverId": "DRIVER123",
      "status": "Active",
      "firstName": "John",
      "lastName": "Doe",
      "truckId": "TRUCK001",
      "phoneNumber": "(555) 123-4567",
      "email": "john.doe@company.com",
      "hiredOn": "2023-01-15",
      "companyId": "COMP001",
      "dispatcher": "DISP001",
      "firstLanguage": "English",
      "secondLanguage": "Spanish",
      "globalDnd": false,
      "safetyCall": true,
      "safetyMessage": true,
      "hosSupport": true,
      "maintainanceCall": false,
      "maintainanceMessage": true,
      "dispatchCall": true,
      "dispatchMessage": true,
      "accountCall": false,
      "accountMessage": true,
      "telegramId": "123456789"
    }
  ]
}
```

**Example**:
```bash
curl -X GET http://localhost:8000/api/drivers
```

---

### **📊 Driver Reports Endpoints**

#### **1. Get All Driver Reports**
```http
GET /api/driver-reports
```

**Description**: Retrieves all driver GPS and safety reports

**Query Parameters**:
- `limit` (optional): Number of records to return
- `offset` (optional): Number of records to skip
- `driverId` (optional): Filter by specific driver

**Response**:
```json
{
  "status": 200,
  "message": "Driver reports fetched successfully",
  "data": [
    {
      "id": 1,
      "tripId": "TRIP123",
      "dispatcherName": "Jane Smith",
      "driverIdPrimary": "DRIVER123",
      "driverIdSecondary": "DRIVER456",
      "Calculation": "Route calculation data",
      "onTimeStatus": "On Time",
      "eta": "2024-01-15T14:30:00Z",
      "pickupTime": "2024-01-15T08:00:00Z",
      "deliveryTime": "2024-01-15T16:00:00Z",
      "milesRemaining": 45.5,
      "gpsSpeed": 65.2,
      "currentLocation": "40.7128,-74.0060",
      "destinationCity": "New York",
      "destinationState": "NY",
      "etaNotes": "Traffic delay on I-95",
      "loadingCity": "Chicago",
      "loadingState": "IL",
      "arrivedLoading": "2024-01-15T08:15:00Z",
      "departedLoading": "2024-01-15T09:30:00Z",
      "arrivedDelivery": null,
      "leftDelivery": null,
      "deliveryLateAfterTime": "2024-01-15T16:30:00Z",
      "tripStatusText": 2,
      "subStatus": 1,
      "driverFeeling": "Good",
      "driverName": "John Doe",
      "onTime": "Yes",
      "driverETAfeedback": "Making good time",
      "delayReason": null,
      "additionalDriverNotes": "All systems normal",
      "slackPosted": "Yes",
      "callStatus": "Not Called",
      "reportDate": "2024-01-15T12:00:00Z",
      "createdAt": "2024-01-15T12:00:00Z",
      "updatedAt": "2024-01-15T12:00:00Z"
    }
  ]
}
```

**Example**:
```bash
curl -X GET http://localhost:8000/api/driver-reports
```

---

### **🏢 Account Management Endpoints**

#### **1. Get Account Information**
```http
GET /api/account-info
```

**Description**: Retrieves RingCentral account information

**Response**:
```json
{
  "id": "account_123",
  "name": "Your Company Name",
  "mainNumber": "+1-555-123-4567",
  "status": "Confirmed",
  "serviceInfo": {
    "uri": "https://platform.ringcentral.com/restapi/v1.0/account/123/service-info",
    "brand": {
      "id": "brand_123",
      "name": "RingCentral"
    }
  }
}
```

**Example**:
```bash
curl -X GET http://localhost:8000/api/account-info
```

---

### **🗺️ Route Planning Endpoints**

#### **1. Calculate ETA**
```http
POST /api/eta
```

**Description**: Calculates ETA for truck routes using PC*MILER API

**Request Body**:
```json
{
  "origin": "Chicago, IL",
  "destination": "New York, NY",
  "departureTime": "2024-01-15T08:00:00Z"
}
```

**Response**:
```json
{
  "origin": "Chicago, IL",
  "destination": "New York, NY",
  "distance": 787.5,
  "travelTimeHours": 12.5,
  "eta": "2024-01-15T20:30:00Z"
}
```

**Example**:
```bash
curl -X POST http://localhost:8000/api/eta \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Chicago, IL",
    "destination": "New York, NY",
    "departureTime": "2024-01-15T08:00:00Z"
  }'
```

---

## ⚡ Rate Limiting

### **Current Implementation**
- No explicit rate limiting implemented
- RingCentral API has its own rate limits
- PC*MILER API has usage limits

### **Recommended Rate Limiting**
```javascript
// Add rate limiting middleware
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

---

## 🧪 Testing

### **Health Check**
```bash
curl -X GET http://localhost:8000/
# Response: "✅ RingCentral API Server Running"
```

### **Testing Authentication**
```bash
# 1. Start login flow
curl -X GET http://localhost:8000/auth/login

# 2. Check if token exists
ls storage/token.json

# 3. Test protected endpoint
curl -X GET http://localhost:8000/api/account-info
```

### **Testing Telephony**
```bash
# Test single call
curl -X POST http://localhost:8000/api/make-call

# Test batch calls
curl -X GET http://localhost:8000/api/drivers-call

# Check active calls
curl -X GET http://localhost:8000/api/active-calls
```

### **Testing Driver Data**
```bash
# Get all drivers
curl -X GET http://localhost:8000/api/drivers

# Get driver reports
curl -X GET http://localhost:8000/api/driver-reports
```

### **Testing Route Planning**
```bash
# Calculate ETA
curl -X POST http://localhost:8000/api/eta \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Chicago, IL",
    "destination": "New York, NY"
  }'
```

---

## 📱 SDK Examples

### **JavaScript/Node.js**
```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:8000';

// Get all drivers
const getDrivers = async () => {
  try {
    const response = await axios.get(`${API_BASE}/api/drivers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching drivers:', error.response.data);
  }
};

// Make batch calls
const makeBatchCalls = async () => {
  try {
    const response = await axios.get(`${API_BASE}/api/drivers-call`);
    return response.data;
  } catch (error) {
    console.error('Error making batch calls:', error.response.data);
  }
};

// Calculate ETA
const calculateETA = async (origin, destination) => {
  try {
    const response = await axios.post(`${API_BASE}/api/eta`, {
      origin,
      destination
    });
    return response.data;
  } catch (error) {
    console.error('Error calculating ETA:', error.response.data);
  }
};
```

### **Python**
```python
import requests

API_BASE = 'http://localhost:8000'

def get_drivers():
    try:
        response = requests.get(f'{API_BASE}/api/drivers')
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error fetching drivers: {e}')

def make_batch_calls():
    try:
        response = requests.get(f'{API_BASE}/api/drivers-call')
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error making batch calls: {e}')

def calculate_eta(origin, destination):
    try:
        response = requests.post(f'{API_BASE}/api/eta', json={
            'origin': origin,
            'destination': destination
        })
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error calculating ETA: {e}')
```

### **cURL Examples**
```bash
# Get all drivers
curl -X GET http://localhost:8000/api/drivers

# Get driver reports
curl -X GET http://localhost:8000/api/driver-reports

# Make batch calls
curl -X GET http://localhost:8000/api/drivers-call

# Calculate ETA
curl -X POST http://localhost:8000/api/eta \
  -H "Content-Type: application/json" \
  -d '{"origin": "Chicago, IL", "destination": "New York, NY"}'

# Get account info
curl -X GET http://localhost:8000/api/account-info
```

---

## 🔧 Environment Setup

### **Required Environment Variables**
```env
# Database
NODE_DATABASE_NAME=your_database_name
NODE_DATABASE_USER=your_username
NODE_DATABASE_PASSWORD=your_password
NODE_DATABASE_HOST=localhost

# RingCentral
RC_CLIENT_ID=your_ringcentral_client_id
RC_CLIENT_SECRET=your_ringcentral_client_secret
RC_SERVER=https://platform.ringcentral.com
RC_REDIRECT_URI=http://localhost:8000/auth/callback

# PC*MILER
PCMILER_API_KEY=your_pcmiler_api_key

# Server
PORT=8000
```

### **Installation**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

---

## 📚 Additional Resources

- **RingCentral API Documentation**: https://developers.ringcentral.com/
- **PC*MILER API Documentation**: https://pcmiler.alk.com/apis/
- **Express.js Documentation**: https://expressjs.com/
- **Sequelize Documentation**: https://sequelize.org/

---

*Last Updated: $(date)*
*API Version: 1.0.0* 