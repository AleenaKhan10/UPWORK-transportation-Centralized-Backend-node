# 🗄️ Database Schema Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Database Configuration](#database-configuration)
3. [Table Schemas](#table-schemas)
4. [Relationships](#relationships)
5. [Data Flow](#data-flow)
6. [Indexes & Performance](#indexes--performance)
7. [Sample Queries](#sample-queries)
8. [Migration Guide](#migration-guide)

---

## 📊 Overview

The RingCentral Backend uses a **MySQL** database with **Sequelize ORM** for data management. The system manages driver information, GPS tracking data, and telephony operations for a trucking/logistics company.

### **Database Architecture**
```
┌─────────────────┐    ┌─────────────────┐
│   driversDirectory │    │   driver_reports │
│   (Driver Info)   │◄──►│   (GPS/Safety)   │
└─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Communication │    │   Safety        │
│   Preferences   │    │   Monitoring    │
└─────────────────┘    └─────────────────┘
```

---

## ⚙️ Database Configuration

### **Connection Settings**
```javascript
// database/dbConnection.js
const sequelize = new Sequelize(
  process.env.NODE_DATABASE_NAME,    // Database name
  process.env.NODE_DATABASE_USER,    // Username
  process.env.NODE_DATABASE_PASSWORD, // Password
  {
    host: process.env.NODE_DATABASE_HOST,
    dialect: "mysql",
    logging: false, // SQL queries in console (dev only)
  }
);
```

### **Environment Variables Required**
```env
NODE_DATABASE_NAME=your_database_name
NODE_DATABASE_USER=your_username
NODE_DATABASE_PASSWORD=your_password
NODE_DATABASE_HOST=localhost
```

---

## 📋 Table Schemas

### **1. driversDirectory Table**

**Purpose**: Stores comprehensive driver information and communication preferences

**Table Name**: `driversDirectory`

| Field | Type | Length | Nullable | Key | Description |
|-------|------|--------|----------|-----|-------------|
| `driverId` | VARCHAR | 100 | NO | PRIMARY | Unique driver identifier |
| `status` | VARCHAR | 100 | YES | - | Driver employment status |
| `firstName` | VARCHAR | 100 | YES | - | Driver's first name |
| `lastName` | VARCHAR | 100 | YES | - | Driver's last name |
| `truckId` | VARCHAR | 100 | YES | - | Assigned truck identifier |
| `phoneNumber` | VARCHAR | 100 | YES | - | Driver's contact number |
| `email` | VARCHAR | 100 | YES | - | Driver's email address |
| `hiredOn` | VARCHAR | 100 | YES | - | Date driver was hired |
| `updatedOn` | VARCHAR | 100 | YES | - | Last update timestamp |
| `companyId` | VARCHAR | 100 | YES | - | Company identifier |
| `dispatcher` | VARCHAR | 100 | YES | - | Assigned dispatcher |
| `firstLanguage` | VARCHAR | 100 | YES | - | Primary language |
| `secondLanguage` | VARCHAR | 100 | YES | - | Secondary language |
| `globalDnd` | BOOLEAN | - | YES | - | Global do-not-disturb setting |
| `safetyCall` | BOOLEAN | - | YES | - | Enable safety calls |
| `safetyMessage` | BOOLEAN | - | YES | - | Enable safety messages |
| `hosSupport` | BOOLEAN | - | YES | - | Hours of service support |
| `maintainanceCall` | BOOLEAN | - | YES | - | Enable maintenance calls |
| `maintainanceMessage` | BOOLEAN | - | YES | - | Enable maintenance messages |
| `dispatchCall` | BOOLEAN | - | YES | - | Enable dispatch calls |
| `dispatchMessage` | BOOLEAN | - | YES | - | Enable dispatch messages |
| `accountCall` | BOOLEAN | - | YES | - | Enable account calls |
| `accountMessage` | BOOLEAN | - | YES | - | Enable account messages |
| `telegramId` | VARCHAR | 100 | YES | - | Telegram chat ID |

**Sequelize Model Definition**:
```javascript
const Driver = sequelize.define("Driver", {
  driverId: {
    type: DataTypes.STRING(100),
    primaryKey: true,
  },
  // ... other fields
}, {
  tableName: "driversDirectory",
  timestamps: false,
});
```

### **2. driver_reports Table**

**Purpose**: Stores GPS tracking data, trip information, and safety monitoring data

**Table Name**: `driver_reports`

| Field | Type | Length | Nullable | Key | Description |
|-------|------|--------|----------|-----|-------------|
| `id` | INT | - | NO | PRIMARY | Auto-increment primary key |
| `tripId` | VARCHAR | - | YES | - | Unique trip identifier |
| `dispatcherName` | VARCHAR | - | YES | - | Dispatcher handling trip |
| `driverIdPrimary` | VARCHAR | - | YES | INDEX | Primary driver ID (FK to driversDirectory) |
| `driverIdSecondary` | VARCHAR | - | YES | - | Secondary driver ID |
| `Calculation` | VARCHAR | - | YES | - | Route calculation data |
| `onTimeStatus` | VARCHAR | - | YES | - | On-time delivery status |
| `eta` | VARCHAR | - | YES | - | Estimated time of arrival |
| `pickupTime` | VARCHAR | - | YES | - | Scheduled pickup time |
| `deliveryTime` | VARCHAR | - | YES | - | Scheduled delivery time |
| `milesRemaining` | DECIMAL | 10,2 | YES | - | Remaining trip distance |
| `gpsSpeed` | DECIMAL | 10,2 | YES | - | Current GPS speed (mph) |
| `currentLocation` | VARCHAR | - | YES | - | Current GPS coordinates |
| `destinationCity` | VARCHAR | - | YES | - | Destination city |
| `destinationState` | VARCHAR | - | YES | - | Destination state |
| `etaNotes` | TEXT | - | YES | - | ETA-related notes |
| `loadingCity` | VARCHAR | - | YES | - | Loading city |
| `loadingState` | VARCHAR | - | YES | - | Loading state |
| `arrivedLoading` | VARCHAR | - | YES | - | Loading arrival time |
| `departedLoading` | VARCHAR | - | YES | - | Loading departure time |
| `arrivedDelivery` | VARCHAR | - | YES | - | Delivery arrival time |
| `leftDelivery` | VARCHAR | - | YES | - | Delivery departure time |
| `deliveryLateAfterTime` | VARCHAR | - | YES | - | Late delivery threshold |
| `tripStatusText` | INT | - | YES | - | Trip status code |
| `subStatus` | INT | - | YES | INDEX | Safety status code (1,3,5 trigger calls) |
| `driverFeeling` | VARCHAR | - | YES | - | Driver wellness status |
| `driverName` | VARCHAR | - | YES | - | Driver name (redundant) |
| `onTime` | VARCHAR | - | YES | - | On-time status |
| `driverETAfeedback` | TEXT | - | YES | - | Driver ETA feedback |
| `delayReason` | TEXT | - | YES | - | Delay explanation |
| `additionalDriverNotes` | TEXT | - | YES | - | Additional notes |
| `slackPosted` | VARCHAR | - | YES | - | Slack notification status |
| `callStatus` | VARCHAR | - | YES | - | Call attempt status |
| `reportDate` | VARCHAR | - | YES | INDEX | Report timestamp |
| `createdAt` | DATETIME | - | NO | - | Record creation time |
| `updatedAt` | DATETIME | - | NO | - | Record update time |

**Sequelize Model Definition**:
```javascript
const DriverReport = sequelize.define("DriverReport", {
  tripId: DataTypes.STRING,
  driverIdPrimary: DataTypes.STRING,
  gpsSpeed: DataTypes.DECIMAL(10, 2),
  subStatus: DataTypes.INTEGER,
  // ... other fields
}, {
  tableName: "driver_reports",
  timestamps: true,
});
```

---

## 🔗 Relationships

### **Current Implementation**
The system uses **manual relationship handling** rather than Sequelize associations:

```javascript
// Manual join in controllers
const reports = await DriverReport.findAll();
const drivers = await Driver.findAll();

const matchedDrivers = filteredReports
  .map((report) => {
    const driver = drivers.find(
      (d) => d.driverId === report.driverIdPrimary
    );
    return driver ? { ...driver.toJSON(), report } : null;
  })
  .filter(Boolean);
```

### **Recommended Sequelize Associations**
```javascript
// Add to models for proper relationships
Driver.hasMany(DriverReport, {
  foreignKey: 'driverIdPrimary',
  sourceKey: 'driverId'
});

DriverReport.belongsTo(Driver, {
  foreignKey: 'driverIdPrimary',
  targetKey: 'driverId'
});
```

### **Relationship Diagram**
```
┌─────────────────┐         ┌─────────────────┐
│   Driver        │         │   DriverReport  │
│                 │         │                 │
│   driverId (PK) │◄────────┤ driverIdPrimary │
│   firstName     │         │   tripId        │
│   lastName      │         │   gpsSpeed      │
│   phoneNumber   │         │   subStatus     │
│   status        │         │   reportDate    │
│   ...           │         │   ...           │
└─────────────────┘         └─────────────────┘
```

---

## 📊 Data Flow

### **1. Safety Monitoring Flow**
```
GPS Data → DriverReport → Filter (subStatus 1,3,5) → Speed Check (>5mph) → Call Driver
```

### **2. Automated Calling Process**
```javascript
// 1. Fetch all reports
const reports = await DriverReport.findAll();

// 2. Filter safety violations
const filteredReports = reports.filter((report) => {
  return (
    [1, 3, 5].includes(Number(report.subStatus)) &&
    parseFloat(report.gpsSpeed) > 5
  );
});

// 3. Match with drivers
const matchedDrivers = filteredReports
  .map((report) => {
    const driver = drivers.find(
      (d) => d.driverId === report.driverIdPrimary
    );
    return driver ? { ...driver.toJSON(), report } : null;
  })
  .filter(Boolean);

// 4. Make calls
for (const driver of matchedDrivers) {
  // RingCentral API call
}
```

### **3. Data Lifecycle**
```
Driver Registration → GPS Tracking → Safety Monitoring → Automated Calls → Status Updates
```

---

## ⚡ Indexes & Performance

### **Recommended Indexes**
```sql
-- Primary keys (already exist)
ALTER TABLE driversDirectory ADD PRIMARY KEY (driverId);
ALTER TABLE driver_reports ADD PRIMARY KEY (id);

-- Foreign key index
CREATE INDEX idx_driver_reports_driver_id ON driver_reports(driverIdPrimary);

-- Query optimization indexes
CREATE INDEX idx_driver_reports_sub_status ON driver_reports(subStatus);
CREATE INDEX idx_driver_reports_gps_speed ON driver_reports(gpsSpeed);
CREATE INDEX idx_driver_reports_report_date ON driver_reports(reportDate);
CREATE INDEX idx_driver_reports_trip_id ON driver_reports(tripId);

-- Composite indexes for common queries
CREATE INDEX idx_driver_reports_status_speed ON driver_reports(subStatus, gpsSpeed);
CREATE INDEX idx_driver_reports_driver_date ON driver_reports(driverIdPrimary, reportDate);
```

### **Performance Considerations**
- **GPS Speed Queries**: Index on `gpsSpeed` for speed violation checks
- **Status Filtering**: Index on `subStatus` for safety code filtering
- **Date Range Queries**: Index on `reportDate` for time-based reports
- **Driver Lookups**: Index on `driverIdPrimary` for driver matching

---

## 🔍 Sample Queries

### **1. Get Drivers with Safety Violations**
```javascript
// Find drivers with speed > 5mph and specific status codes
const safetyViolations = await DriverReport.findAll({
  where: {
    subStatus: [1, 3, 5],
    gpsSpeed: {
      [Op.gt]: 5
    }
  },
  include: [{
    model: Driver,
    as: 'driver',
    where: {
      safetyCall: true
    }
  }]
});
```

### **2. Get Driver Communication Preferences**
```javascript
const driverPrefs = await Driver.findOne({
  where: { driverId: 'DRIVER123' },
  attributes: [
    'driverId', 'firstName', 'lastName', 'phoneNumber',
    'safetyCall', 'safetyMessage', 'dispatchCall', 'dispatchMessage'
  ]
});
```

### **3. Get Recent Reports for Driver**
```javascript
const recentReports = await DriverReport.findAll({
  where: { driverIdPrimary: 'DRIVER123' },
  order: [['reportDate', 'DESC']],
  limit: 10
});
```

### **4. Get Active Trips**
```javascript
const activeTrips = await DriverReport.findAll({
  where: {
    tripStatusText: {
      [Op.in]: [1, 2, 3] // Active status codes
    }
  },
  include: [{
    model: Driver,
    as: 'driver',
    attributes: ['firstName', 'lastName', 'phoneNumber']
  }]
});
```

### **5. Safety Monitoring Query**
```javascript
// Get all drivers that need safety calls
const safetyCalls = await DriverReport.findAll({
  where: {
    subStatus: [1, 3, 5],
    gpsSpeed: {
      [Op.gt]: 5
    }
  },
  include: [{
    model: Driver,
    as: 'driver',
    where: {
      safetyCall: true,
      globalDnd: false
    }
  }]
});
```

---

## 🚀 Migration Guide

### **Adding New Fields**
```javascript
// 1. Update Sequelize model
const Driver = sequelize.define("Driver", {
  // ... existing fields
  newField: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
});

// 2. Create migration
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('driversDirectory', 'newField', {
      type: Sequelize.STRING(100),
      allowNull: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('driversDirectory', 'newField');
  }
};
```

### **Adding Indexes**
```javascript
// Add index for performance
await queryInterface.addIndex('driver_reports', ['subStatus', 'gpsSpeed'], {
  name: 'idx_safety_monitoring'
});
```

### **Data Validation**
```javascript
// Add constraints
await queryInterface.addConstraint('driver_reports', {
  fields: ['gpsSpeed'],
  type: 'check',
  name: 'gps_speed_positive',
  where: {
    gpsSpeed: {
      [Op.gte]: 0
    }
  }
});
```

---

## 📈 Monitoring & Maintenance

### **Database Health Checks**
```javascript
// Connection test
sequelize.authenticate()
  .then(() => console.log("Database connected ✅"))
  .catch((err) => console.error("DB connection error ❌:", err));

// Table size monitoring
const tableSizes = await sequelize.query(`
  SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
  FROM information_schema.tables 
  WHERE table_schema = '${process.env.NODE_DATABASE_NAME}'
`);
```

### **Performance Monitoring**
```javascript
// Slow query logging
const sequelize = new Sequelize({
  // ... config
  logging: (sql, timing) => {
    if (timing > 1000) { // Log queries > 1 second
      console.warn(`Slow query (${timing}ms):`, sql);
    }
  }
});
```

### **Backup Strategy**
```bash
# Daily backup
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql

# Automated backup script
0 2 * * * /usr/bin/mysqldump -u username -p database_name > /backups/daily_backup.sql
```

---

## 🔧 Troubleshooting

### **Common Issues**

1. **Connection Timeouts**
   ```javascript
   // Add connection pool settings
   const sequelize = new Sequelize({
     // ... config
     pool: {
       max: 5,
       min: 0,
       acquire: 30000,
       idle: 10000
     }
   });
   ```

2. **Memory Issues**
   ```javascript
   // Use pagination for large datasets
   const reports = await DriverReport.findAll({
     limit: 1000,
     offset: 0
   });
   ```

3. **Data Consistency**
   ```javascript
   // Use transactions for critical operations
   const transaction = await sequelize.transaction();
   try {
     await DriverReport.create(data, { transaction });
     await Driver.update(updateData, { transaction });
     await transaction.commit();
   } catch (error) {
     await transaction.rollback();
     throw error;
   }
   ```

---

## 📚 Additional Resources

- **Sequelize Documentation**: https://sequelize.org/
- **MySQL Documentation**: https://dev.mysql.com/doc/
- **Database Design Best Practices**: https://www.mysql.com/why-mysql/white-papers/
- **Performance Tuning**: https://dev.mysql.com/doc/refman/8.0/en/optimization.html

---

*Last Updated: $(date)*
*Version: 1.0.0* 