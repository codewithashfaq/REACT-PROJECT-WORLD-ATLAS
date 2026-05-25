# WorldAtlas — Country Explorer App

A modern, fully responsive React application for exploring detailed information about every country in the world, powered by the [REST Countries API](https://restcountries.com/).

Search, filter, sort, and dive deep into any country — with an AI assistant ready to answer your geography questions in real time.

---

## Live Demo

> https://world-atlas-ashfaq.netlify.app/

---

## Features

### Core

- **Search** countries by name in real time
- **Filter** by region (Africa, Americas, Asia, Europe, Oceania)
- **Sort** alphabetically — A → Z or Z → A
- **Country detail page** — flag, official name, native names, population, region, subregion, capital, top-level domain, currencies, languages, and bordering countries
- **Responsive design** — works seamlessly on mobile, tablet, and desktop

### AI Assistant

- **Floating AI chatbot** powered by OpenRouter (GPT model) — available on every page
- **Context-aware conversations** — when you visit a country's detail page, the AI automatically loads that country's data and answers questions about it specifically
- **Rich markdown rendering** — AI responses support tables, numbered lists, bullet points, headings, blockquotes, and inline code
- **Voice input** — speak your question using the Web Speech API
- **Quick prompt chips** — one-tap suggested questions that adapt based on whether you're viewing a specific country
- **Multi-turn memory** — last 10 messages are sent as context so the AI remembers the conversation
- **Export chat** — download the full conversation as a `.txt` file
- **Unread badge** — shows how many AI replies you've missed while the chat was closed
- **Thumbs up / down feedback** on every AI response
- **Minimize / restore** the chat window without losing the conversation

### UX & Polish

- Smooth **scroll-to-top** button — appears after 300px of scroll, moves to the bottom-left corner on mobile so it never overlaps the AI chatbot
- Full-page **loading spinner** while data is being fetched
- Graceful **error states** — network failures surface a readable message instead of a blank screen
- Sticky header with **animated underline** on active nav links
- **Hamburger menu** on tablet and mobile with auto-close on navigation
- Gradient card borders, hover animations, and a dark theme throughout

---

## Tech Stack

| Layer          | Technology                                            |
| -------------- | ----------------------------------------------------- |
| UI Framework   | React 18 (with Hooks)                                 |
| Routing        | React Router v6.4+ (Data Router API)                  |
| HTTP Client    | Axios                                                 |
| AI Integration | OpenRouter API (GPT model via `/v1/chat/completions`) |
| Icons          | React Icons                                           |
| Styling        | CSS (custom, no framework)                            |
| Data Source    | REST Countries API v3.1                               |
| Voice Input    | Web Speech API (browser native)                       |

---

## Project Structure

```
src/
├── api/
│   ├── CountriesData.js   # Axios instance + REST Countries API calls
│   ├── AskAi.js           # OpenRouter AI service + system prompt builder
│   ├── CountryData.json   # Static country facts for the About page
│   └── FooterData.json    # Footer contact info
│
├── components/
│   ├── AIChatBot.jsx      # Floating AI chat assistant (full feature set)
│   ├── CountryCard.jsx    # Single country card for the listing grid
│   ├── CountryDetails.jsx # Full detail view for one country
│   ├── HeroSection.jsx    # Landing banner with headline and CTA
│   ├── Loader.jsx         # Full-page loading spinner
│   ├── ScrollToTop.jsx    # Floating scroll-to-top button
│   └── SearchFilter.jsx   # Search input, sort buttons, region dropdown
│
├── layout/
│   └── AppLayout.jsx      # Root layout — Header, Outlet, Footer, ScrollToTop, AIChatBot
│
├── pages/
│   ├── Home.jsx           # "/" — HeroSection + About
│   ├── About.jsx          # "/about" — country facts card grid
│   ├── Country.jsx        # "/country" — listing page with search/filter
│   ├── Contact.jsx        # "/contact" — contact form
│   └── ErrorPage.jsx      # Catch-all error boundary for all routes
│
├── App.jsx                # Router configuration (createBrowserRouter)
├── App.css                # All styles — global, layout, components, responsive
└── main.jsx               # React DOM entry point
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/codewithashfaq/world-atlas.git
cd world-atlas

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Add your OpenRouter API key to the .env file (see Environment Variables below)

# 4. Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Get your free API key at [openrouter.ai](https://openrouter.ai/).

> **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## Responsive Breakpoints

| Breakpoint | Layout                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------- |
| > 998px    | Full desktop — horizontal nav, two/three/four column grids                               |
| ≤ 998px    | Hamburger menu replaces nav links                                                        |
| ≤ 768px    | AI chatbot collapses to icon-only circle                                                 |
| ≤ 600px    | Split-corner buttons — scroll-to-top moves to bottom-left, AI chatbot stays bottom-right |
| ≤ 480px    | Single column layout, full-screen chat panel                                             |

---

## API Reference

### REST Countries API

Base URL: `https://restcountries.com/v3.1`

| Endpoint                                   | Used for             |
| ------------------------------------------ | -------------------- |
| `GET /all?fields=...`                      | Country listing page |
| `GET /name/:name?fullText=true&fields=...` | Country detail page  |

### OpenRouter AI API

Base URL: `https://openrouter.ai/api/v1`

| Endpoint                 | Used for             |
| ------------------------ | -------------------- |
| `POST /chat/completions` | AI chatbot responses |

---

## Author

**Ashfaq Khan** - Frontend Developer
https://github.com/codewithashfaq | https://www.linkedin.com/in/ashfaaq-khan/

---

## License

This project is open source and available under the [MIT License](LICENSE).
