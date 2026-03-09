// pages/api/rate-limited.js

let lastRequestTime = 0;
const RATE_LIMIT_WINDOW = 1000; // 1 second

export default function handler(req, res) {
  const now = Date.now();
  if (now - lastRequestTime < RATE_LIMIT_WINDOW) {
    return res
      .status(429)
      .json({ error: "Too many requests. Please slow down." });
  }
  lastRequestTime = now;

  res.status(200).json({ message: "Action performed successfully!" });
}
