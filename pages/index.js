import Head from "next/head";
import { useState, useCallback } from "react";

export default function Home() {
  // Debounce Search State
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  // Rate-limited Action State
  const [rateMsg, setRateMsg] = useState("");
  const [rateLoading, setRateLoading] = useState(false);

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

  return (
    <div className="container py-5">
      <Head>
        <title>Next.js Debounce & Rate Limit</title>
      </Head>
      <main>
        <h2 className="mb-4 text-center">Debounce & Rate Limiting Demo</h2>
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h4 className="card-title mb-3 text-center">Debounce Search</h4>
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
                <ul className="list-group">
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
          <div className="col-md-6 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h4 className="card-title mb-3 text-center">
                  Rate Limited Action
                </h4>
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
                <p className="text-muted text-center mb-0">
                  This button is protected by server-side rate limiting (1
                  request/sec).
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
