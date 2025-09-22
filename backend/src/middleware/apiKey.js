/**
 * API Key Security Middleware
 * 
 * Protects sensitive endpoints (like dispatch) from unauthorized access
 * by validating the X-API-KEY header against the configured secret key.
 */

export const requireApiKey = (req, res, next) => {
  try {
    // Get the API key from the X-API-KEY header
    const providedApiKey = req.headers['x-api-key'];
    
    // Check if API key is provided
    if (!providedApiKey) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'API key is required. Please provide X-API-KEY header.'
      });
    }
    
    // Get the expected API key from environment variables
    const expectedApiKey = process.env.DISPATCH_SECRET_KEY;
    
    // Check if the secret key is configured
    if (!expectedApiKey) {
      console.error('DISPATCH_SECRET_KEY environment variable is not configured');
      return res.status(500).json({
        error: 'Server Configuration Error',
        message: 'API key validation is not properly configured'
      });
    }
    
    // Validate the API key
    if (providedApiKey !== expectedApiKey) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid API key provided'
      });
    }
    
    // API key is valid, proceed to the next middleware/route handler
    next();
    
  } catch (error) {
    console.error('Error in API key middleware:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred during API key validation'
    });
  }
};