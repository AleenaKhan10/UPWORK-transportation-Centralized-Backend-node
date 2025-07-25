// utils/vapiClient.js
const axios = require('axios');
require('dotenv').config();

const VAPI_BASE_URL = 'https://api.vapi.ai';

/**
 * Create a VAPI call with driver information
 * @param {Object|Array} driverData - Single driver object or array of driver objects
 * @returns {Promise<Object>} - VAPI call response
 */
const createVapiCall = async (driverData) => {
  try {
    // Validate required environment variables
    if (!process.env.VAPI_API_KEY) {
      throw new Error('VAPI_API_KEY environment variable is required');
    }
    if (!process.env.VAPI_ASSISTANT_ID) {
      throw new Error('VAPI_ASSISTANT_ID environment variable is required');
    }
    if (!process.env.VAPI_PHONENUMBER_ID) {
      throw new Error('VAPI_PHONENUMBER_ID environment variable is required');
    }

    // Ensure driverData is an array for consistent processing
    const driversArray = Array.isArray(driverData) ? driverData : [driverData];

    // Validate that we have at least one driver
    if (driversArray.length === 0) {
      throw new Error('At least one driver must be provided');
    }

    // Map driver data to VAPI campaign format with multiple customers
    const customers = driversArray.map((driver) => {
      // Validate required driver fields
      if (!driver.phoneNumber || !driver.firstName || !driver.lastName) {
        throw new Error('Driver must have phoneNumber, firstName, and lastName');
      }

      return {
        number: driver.phoneNumber,
        name: `${driver.firstName} ${driver.lastName}`,
        assistantOverrides: {
          variableValues: {
            driverFirstName: driver.firstName,
            driverId: driver.id || driver.driverId || `driver_${Date.now()}_${Math.random()}`,
            currentLocation: driver.currentLocation || 'Los Angeles, CA',
            milesRemaining: driver.milesRemaining || '100',
            deliveryType: driver.deliveryType || 'pickup'
          }
        }
      };
    });

    // Prepare VAPI campaign request with multiple customers
    const requestBody = {
      name: "Daily Driver Check-in",
      phoneNumberId: process.env.VAPI_PHONENUMBER_ID,
      customers: customers,
      assistantId: process.env.VAPI_ASSISTANT_ID
    };

    console.log(`📞 Initiating VAPI campaign call to ${customers.length} driver(s)`);
    customers.forEach((customer, index) => {
      console.log(`   ${index + 1}. ${customer.name} (${customer.number})`);
    });

    // Make API call to VAPI campaign endpoint
    const response = await axios.post(`${VAPI_BASE_URL}/campaign`, requestBody, {
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ VAPI campaign initiated successfully. Campaign ID: ${response.data.id}`);
    
    return {
      success: true,
      campaignId: response.data.id,
      callId: response.data.id, // For backward compatibility
      status: response.data.status || 'initiated',
      customerCount: customers.length,
      customers: customers.map(customer => ({
        name: customer.name,
        number: customer.number,
        driverId: customer.assistantOverrides.variableValues.driverId
      }))
    };

  } catch (error) {
    console.error('❌ Error creating VAPI call:', error.message);
    
    // Handle different error types
    if (error.response) {
      // API responded with error status
      throw new Error(`VAPI API Error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
      // Network error
      throw new Error('Network error: Unable to reach VAPI API');
    } else {
      // Other errors (validation, etc.)
      throw error;
    }
  }
};

/**
 * Get call status from VAPI
 * @param {string} callId - VAPI call ID
 * @returns {Promise<Object>} - Call status information
 */
const getCallStatus = async (callId) => {
  try {
    const response = await axios.get(`${VAPI_BASE_URL}/call/${callId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error(`❌ Error getting call status for ${callId}:`, error.message);
    throw error;
  }
};

module.exports = {
  createVapiCall,
  getCallStatus
}; 