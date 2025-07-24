// utils/vapiClient.js
const axios = require('axios');
require('dotenv').config();

const VAPI_BASE_URL = 'https://api.vapi.ai';

/**
 * Create a VAPI call with driver information
 * @param {Object} driverData - Driver information to pass to VAPI
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

    // Map driver data to VAPI campaign format with single customer
    const customer = {
      number: driverData.phoneNumber,
      name: `${driverData.firstName} ${driverData.lastName}`,
      assistantOverrides: {
        variableValues: {
          driverFirstName: driverData.firstName,
          currentLocation: 'Los Angeles, CA',
          milesRemaining: '100',
          deliveryType: 'pickup'
        }
      }
    };

    // Prepare VAPI campaign request with single customer
    const requestBody = {
      name: "Daily Driver Check-in",
      phoneNumberId: process.env.VAPI_PHONENUMBER_ID,
      customers: [customer], // Array with single customer
      assistantId: process.env.VAPI_ASSISTANT_ID
    };

    console.log(`📞 Initiating VAPI campaign call to ${customer.name} (${customer.number})`);

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
      customer: {
        name: customer.name,
        number: customer.number,
        driverId: customer.assistantOverrides.variableValues.driverId
      }
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