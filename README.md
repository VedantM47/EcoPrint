# SplitCOI — UI Prototype

This repository contains a UI-only prototype for SplitCOI: a carbon & cost splitting app focused on India (onboarding, manual activity input, dashboard visualizations, OCR-bill scanner UI, split groups).

Tech: React + Vite + Recharts (UI-only).

How to run
1. Install:
   - Node 18+ recommended
   - npm install

2. Run:
   - npm run dev
   - Open http://localhost:5173

What is included
- Onboarding form (saves profile to localStorage).
- Dashboard with:
  - Summary, mock progress bar and recommendations area.
  - Area and bar charts using Recharts (mocked data derived from activities).
  - Activity add form (auto-estimates CO₂ and cost when fields left blank — simple placeholder logic).
  - Bill scanner UI that accepts files and mocks extracted data.
  - SplitCOI group creation UI (UI-only).
- LocalStorage persistence for activities & user (so you can click through).

Notes & next steps
- This is purely front-end; authentication, OCR, emission factor datasets, AI recommendations, and backend persistence are not implemented.
- Next development steps (I can implement next):
  - Add a Node/Express or FastAPI backend and connect endpoints for saving user/activities.
  - Integrate real Indian emission factor datasets (CEA, NITI Aayog) for accurate calculations.
  - Add Firebase/Twilio OTP auth flows.
  - Integrate Google Vision API or Tesseract.js for OCR extraction.
  - Integrate OpenAI/Gemini for personalized recommendations.
  - Implement share links / QR code generation for group splits and handle permissions.

If you want, I can:
- Push this scaffold into a GitHub repo for you, or
- Convert this to a Next.js app (pages + server routes), or
- Wire one or two backend endpoints and connect OCR / OpenAI prototypes.

Tell me which of the above you'd like next and I'll implement it.