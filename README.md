# Next.js Debounce Search & Rate Limiter

A  Next.js algorithm demo app featuring:

- Debounced search with Bootstrap UI
- Server-side rate-limited action
- Rate-limited feedback form

## Features

- **Debounce Search:** Search a list of fruits with input debouncing after search completed.
- **Rate-Limited Action:** Button protected by server-side rate limiting (1 request/sec).
- **Rate-Limited Feedback:** Feedback form that can only be submitted once every 5 seconds.
- **Responsive Bootstrap Layout:** Clean, modern, and mobile-friendly.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/amanTesfa/nextjs-debounce-search-and-rate-limiter.git
   cd nextjs-debounce-search-and-rate-limiter
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```
4. Open in your browser.

## Usage

- **Debounce Search:** Type in the search box to filter fruits. Results update after you stop typing.
- **Rate-Limited Action:** Click the button to trigger a rate-limited server action.
- **Feedback Form:** Submit feedback (limited to once every 5 seconds).

## Tech Stack

- Next.js
- React
- Bootstrap 5


