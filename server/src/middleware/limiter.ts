import rateLimit from 'express-rate-limit'

// Set limiter on authenticated routes to reduce burden on servers
export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  handler: (req, res) => {
    return res.status(429).json({
      error: 'You sent too many requests. Please wait a while then try again',
    })
  },
})
