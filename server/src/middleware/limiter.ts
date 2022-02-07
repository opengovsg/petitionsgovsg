import rateLimit from 'express-rate-limit'

// Set limiter on authenticated routes to reduce burden on servers
export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 60 requests per windowMs
  handler: function (req, res) {
    return res.status(429).json({
      error: 'You sent too many requests. Please wait a while then try again',
    })
  },
})
