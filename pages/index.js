import Head from "next/head";
import { useState, useCallback } from "react";

export default function Home() {
  // Debounce Search State
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Rate-limited Action State
  const [rateMsg, setRateMsg] = useState("");
  const [rateLoading, setRateLoading] = useState(false);
  // Debounce function
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // Debounced search handler (no rate limit)
  const search = async (searchTerm) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(searchTerm)}`,
      );
      if (!res.ok) {
        setError("An error occurred. Try again.");
        setResults([]);
      } else {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (err) {
      setError("Network error. Try again.");
      setResults([]);
    }
    setLoading(false);
  };
  const debouncedSearch = useCallback(debounce(search, 400), []);
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  // Rate-limited Action Handler
  const handleRateLimitedAction = async () => {
    setRateLoading(true);
    setRateMsg("");
    try {
      const res = await fetch("/api/rate-limited");
      if (res.status === 429) {
        setRateMsg("Too many requests. Please slow down.");
      } else if (!res.ok) {
        setRateMsg("An error occurred. Try again.");
      } else {
        const data = await res.json();
        setRateMsg(data.message || "Success!");
      }
    } catch (err) {
      setRateMsg("Network error. Try again.");
    }
    setRateLoading(false);
  };
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedbackMsg("");
    setFeedbackLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setFeedbackMsg(
          data.error || "You are submitting too quickly. Please wait.",
        );
      } else if (!res.ok) {
        setFeedbackMsg(data.error || "An error occurred. Try again.");
      } else {
        setFeedbackMsg(data.message || "Feedback submitted!");
        setName("");
        setMessage("");
      }
    } catch (err) {
      setFeedbackMsg("Network error. Try again.");
    }
    setFeedbackLoading(false);
  };
  return (
    <div className="container py-5">
      <Head>
        <title>Next.js Debounce & Rate Limit</title>
      </Head>
      <main>
        <h2 className="mb-4 text-center">Debounce & Rate Limiting Demo</h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h4 className="card-title mb-3 text-center">Debounce Search</h4>
                <p className="text-muted text-center mb-3">
                  Search,The results update after you stop typing.
                </p>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search fruits..."
                    value={query}
                    onChange={handleChange}
                  />
                </div>
                {error && (
                  <div
                    className="alert alert-danger py-2 text-center"
                    role="alert"
                  >
                    {error}
                  </div>
                )}
                {loading && (
                  <div className="text-center my-2">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                <ul
                  className="list-group"
                  style={{
                    maxHeight: "50vh",
                    minHeight: "100px",
                    overflowY: "auto",
                  }}
                >
                  {results.map((item, idx) => (
                    <li key={idx} className="list-group-item">
                      {item}
                    </li>
                  ))}
                  {!loading && query && results.length === 0 && !error && (
                    <li className="list-group-item text-muted">
                      No results found.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h4 className="card-title mb-3 text-center">
                  Rate Limited Action
                </h4>
                <p className="text-muted text-center mb-3">
                  only 1 request/sec
                </p>
                <div className="d-grid gap-2 mb-3">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleRateLimitedAction}
                    disabled={rateLoading}
                  >
                    {rateLoading ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      "Perform Action"
                    )}
                  </button>
                </div>
                {rateMsg && (
                  <div
                    className={`alert ${rateMsg.includes("Too many") ? "alert-danger" : "alert-success"} py-2 text-center`}
                    role="alert"
                  >
                    {rateMsg}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h4 className="card-title mb-3 text-center">
                  Rate-Limited Feedback
                </h4>
                <p className="text-muted text-center mb-3">
                  You can submit feedback once every 5 seconds.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      placeholder="Your Feedback"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <div className="d-grid gap-2 mb-2">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg"
                      disabled={feedbackLoading}
                    >
                      {feedbackLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        "Submit Feedback"
                      )}
                    </button>
                  </div>
                  {feedbackMsg && (
                    <div
                      className={`alert ${feedbackMsg.includes("too quickly") ? "alert-danger" : "alert-success"} py-2 text-center`}
                      role="alert"
                    >
                      {feedbackMsg}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
