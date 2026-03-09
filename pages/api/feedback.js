// pages/api/feedback.js

let lastFeedbackTime = 0;
const FEEDBACK_RATE_LIMIT = 5000; // 5 seconds

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const now = Date.now();
  if (now - lastFeedbackTime < FEEDBACK_RATE_LIMIT) {
    return res
      .status(429)
      .json({
        error: "You are submitting too quickly. Please wait a few seconds.",
      });
  }
  lastFeedbackTime = now;
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: "Name and message are required." });
  }
  // Simulate saving feedback
  res
    .status(200)
    .json({ success: true, message: "Feedback submitted successfully!" });
}
