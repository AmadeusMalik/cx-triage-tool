# 🤖 AI-Powered Support Triage Tool

A full-stack Angular application designed to streamline the bridge between Customer Success and Engineering. This tool takes raw, often frustrated customer complaints and uses AI to generate an empathetic response while simultaneously creating a structured technical ticket for developers.

## 🚀 Key Features

AI Sentiment Refinement: Uses a (mocked) OpenAI integration to de-escalate customer tone and draft professional responses.

Technical Ticket Generation: Automatically extracts data into a structured JSON payload for engineering teams.

Cloud Persistence: Integrated with Supabase (PostgreSQL) to ensure all triage reports are saved and searchable.

Data Sanitization: Implements Regex-based scrubbing to ensure data integrity and clean SQL inserts.

Responsive Design: Fully optimized for mobile and desktop views, recognizing that merchants often work on the move.

## 🛠️ The Tech Stack

Frontend: Angular 18 (Standalone Components)

Database: Supabase / PostgreSQL

Styling: Custom CSS3 with Mobile-First Media Queries

Logic: TypeScript & Asynchronous Data Streams

## 🧠 Technical Decisions & Challenges

Why Supabase?
I chose Supabase for its robust Row-Level Security (RLS). Even in a demo environment, I wanted to ensure that data access was governed by strict security policies, mirroring a production-grade merchant dashboard.

Handling Asynchronicity
The app manages multiple async streams (AI simulation and Database I/O). I utilized async/await patterns to prevent race conditions, ensuring the database record only updates after the AI has successfully resolved the response.

Data Sanitization
To maintain a clean database schema, I implemented a custom sanitization layer using .replace(/\n/g, " ").trim() to strip hidden formatting characters from user inputs before they are processed by the JSON stringifier.

## 📦 Installation & Setup

Clone the repo!

Bash: git clone [your-repo-link] /
Install dependencies: npm install /
Run the development server: ng serve
