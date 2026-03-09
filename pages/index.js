import Head from "next/head";
import { useState, useCallback } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce function
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const search = (searchTerm) => {
    setLoading(true);
    setTimeout(() => {
      const data = [
        "Apple",
        "mango",
        "Orange",
        "Pineapple",
        "Strawberry",
        "Watermelon",
        "Avocado",
        "Blueberry",
        "Cantaloupe",
        "Fig",
        "Grapefruit",
        "Kiwi",
        "Lemon",
        "Lime",
        "Melon",
        "Nectarine",
        "Papaya",
        "Peach",
        "Pear",
        "Plum",
        "Raspberry",
        "Strawberry",
        "Tangerine",
        "Ugli fruit",
        "Vanilla",
        "Watermelon",
        "Xigua",
        "Yellow passion fruit",
        "Zucchini",
        "Apricot",
        "Banana",
        "Cherry",
        "Date",
        "Elderberry",
        "Fig",
        "Grape",
        "Honeydew",
      ];
      setResults(
        data.filter((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
      setLoading(false);
    }, 500);
  };

  //useCallbackfor efficiently memoizing(caching) the search function
  const debouncedSearch = useCallback(debounce(search, 400), []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="container py-5">
      <Head>
        <title>Next.js Debounce Search</title>
      </Head>
      <main>
        <h2 className="mb-4 text-center">Debounce Search Example</h2>
        <h5 className="mb-4 text-center">
          Search delays until you stop typing{" "}
        </h5>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search fruits..."
                value={query}
                onChange={handleChange}
              />
            </div>
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
              {!loading && query && results.length === 0 && (
                <li className="list-group-item text-muted">
                  No results found.
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
