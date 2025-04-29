# RAG Text Extraction PoC – Node.js Backend

## 🔍 Purpose

This Proof of Concept (PoC) aims to validate the feasibility of using Large Language Models (LLMs) to extract structured data from free-form property descriptions.

### Focus areas:

- A **single free-text field** (e.g. property notes)
- Extracting structured data points such as:
  - Access instructions
  - Parking information
  - Amenities
  - Door codes, postcodes, etc.
- Applying business rules written in plain text (e.g., markdown)
- Future support for outputting results to a CSV or temporary database
- Evaluation across multiple LLMs: **OpenAI GPT-4**, **Google Gemini** (coming soon)

---

## 🚀 Setup

Make sure you add a .env file with the revelant envs from env.example

1. **Clone the repo**

```bash
git clone https://github.com/Sanins/rag-project
cd rag-project
```

2. **Run the repo**

```bash
npm run install
npm run dev
```

## MySQL Database Setup (Docker)

1. **Start the MySQL container**

```bash
docker compose up -d
```

2. **Resetting the db**

```bash
docker compose down -v
docker compose up -d
```