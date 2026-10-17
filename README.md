<div align="center">

# Clickpoint Innovation — Enterprise Digital Platform & AI Assistant

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.9-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![pgvector](https://img.shields.io/badge/pgvector-384--dim-0ea5e9?style=for-the-badge&logo=vectorlogomaker&logoColor=white)](https://github.com/pgvector/pgvector)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Container-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<p align="center">
  <b>Enterprise digital product engineering consultancy platform featuring a headless dynamic CMS, real-time lead automation, ATS career pipeline, and conversational AI grounded in live PostgreSQL data.</b>
</p>

[🌐 Live Platform](https://clickpoint.com.np) • [📖 Full Developer Guide (MD)](./docs/FULL_WEBSITE_DEVELOPER_DOCUMENTATION.md) • [📄 Full Platform Guide (PDF)](./public/docs/clickpoint_full_website_developer_documentation.pdf) • [🤖 Chatbot Guide (PDF)](./public/docs/clickpoint_ai_chatbot_architecture.pdf)

</div>

---

## ⚡ Overview

**Clickpoint Innovation** is a full-stack digital product engineering consultancy headquartered in Kathmandu, Nepal, delivering enterprise-scale web platforms, cross-platform mobile apps, cloud architectures, and custom AI copilots for global technology teams and startups.

This repository contains the complete unified monorepo for the Clickpoint Innovation digital ecosystem:
* **Public Next.js 14 App Router Platform:** Server-side rendered pages with GSAP and Framer Motion animations, interactive Quick Enquiry modals, public review submissions, and ATS job applications.
* **Administrative Headless CMS & Dashboard:** Real-time content editor for all 12 landing sections and 11 dynamic subpages, optimistic updates with Sonner notifications, automatic cache invalidation (`revalidatePath`), and live audio-visual notification streams (SSE + BroadcastChannel).
* **Conversational AI Assistant (Clix):** Grounded RAG agent using PostgreSQL `pgvector` dense vector embeddings (384-dimensional via `sentence-transformers/all-MiniLM-L6-v2`), semantic re-ranking, candidate injection, and Google Gemini reasoning with automated multi-model fallback.
* **Dual-Mode Resilient Architecture:** Runs at full performance on dedicated Docker/VPS Linux servers with Redis caching and FastAPI microservices, while maintaining direct Supabase batch extraction fallback on serverless Vercel edge environments.

---

## 🎯 Key Platform Features

| Capability | Technical Details |
| :--- | :--- |
| **Dynamic Headless CMS** | Singleton document pattern managing 12 landing page sections and 11 subpages (About, Services, Industries, Case Studies, Journey, Blog, Careers, Testimonials, FAQs, Contact, 404). Changes take effect instantly without code deployment. |
| **Context-Aware AI Chatbot (Clix)** | Grounded RAG architecture with sub-10ms greeting checks, candidate injection for domain queries, automated background vector reindexing on any admin edit, and clean zero-emoji typography. |
| **Applicant Tracking System (ATS)** | Careers pipeline allowing candidates to submit applications with PDF resumes uploaded to Cloudinary. Admins review candidates and send status update emails with custom HTML templates. |
| **Real-Time Notification Engine** | Dual-channel notification system: `BroadcastChannel` for same-browser multi-tab synchronization and Server-Sent Events (SSE via `GET /api/notifications/stream`) for cross-browser/cross-device push alerts with sound chimes. |
| **Custom Tiptap WYSIWYG Editor** | ProseMirror-based rich text editor featuring native HTML5 video uploads, YouTube embeds, drag-and-drop Cloudinary image integration, and clean Markdown output. |
| **Cloudinary Media Lifecycle** | Programmatic media uploads with automatic WebP/AVIF compression. Deleting blog posts or team members automatically purges orphaned assets from the Cloudinary CDN. |
| **Hardened Authentication & RBAC** | Self-hosted Better Auth using salted password hashing, HTTP-only cookie sessions (`better-auth.session_token`), and brute-force rate-limiting (4 attempts per 15 minutes). |

---

## 🏗️ Architecture & Data Flow

```mermaid
flowchart TD
    subgraph ClientLayer [Client & Web Presentation]
        User([Website Visitor])
        Admin([CMS Administrator])
        Widget[Floating Chatbot Widget Clix]
    end

    subgraph NextJSLayer [Next.js 14 Application Layer - Port 3000 / Vercel]
        ChatRoute["POST /api/chat"]
        AdminActions["Server Actions & Admin API Routes"]
        PrismaORM["Prisma ORM Client"]
    end

    subgraph DockerLayer [Dedicated Python Microservices Stack]
        IngestionService["Ingestion Service (FastAPI: 8001)"]
        ChatService["Chat Service (FastAPI: 8002)"]
        RedisCache[("Redis Cache: 6379")]
    end

    subgraph DataLayer [Cloud Infrastructure - Supabase AWS ap-southeast-1]
        PostgresDB[("Supabase PostgreSQL 15+")]
        PGVector[("pgvector: knowledge_chunks")]
    end

    subgraph ExternalLLM [External AI Infrastructure]
        GeminiAPI["Google Gemini API (flash-lite / 3.5 / 3.8)"]
    end

    %% User Interaction Flow
    User -->|Sends message| Widget
    Widget -->|JSON payload| ChatRoute

    %% Tier 1: Static Greeting (<10ms)
    ChatRoute -.->|Tier 1: Instant match| Widget

    %% Tier 2: Microservice Path
    ChatRoute -->|Tier 2: HTTP POST :8002| ChatService
    ChatService <-->|Check / Set Cache| RedisCache
    ChatService -->|Semantic Vector Search| PGVector
    ChatService -->|Prompt + Context| GeminiAPI

    %% Tier 3: Vercel Serverless Direct Fallback
    ChatRoute -->|Tier 3: Fallback if microservice unavailable| PrismaORM
    PrismaORM -->|Extract 13 tables| PostgresDB
    ChatRoute -->|Direct DB Context + Prompt| GeminiAPI

    %% Admin Reindexing Flow
    Admin -->|Updates CMS Content| AdminActions
    AdminActions -->|1. Mutate DB Records| PrismaORM
    AdminActions -->|2. Background HTTP POST /reindex| IngestionService
    IngestionService -->|Extract all DB sources| PostgresDB
    IngestionService -->|Generate 384-dim embeddings| PGVector
    IngestionService -->|Flush stale query cache| RedisCache
```

---

## 🛠️ Technology Stack Breakdown

```
Frontend Tier:
├── Framework: Next.js 14.2.35 (React 18 Server Components & App Router)
├── Language: TypeScript 5.5.4
├── Styling: Tailwind CSS 3.4.7 + Tailwind Animate
├── UI Primitives: Radix UI (Accordion, Dropdown Menu, Navigation Menu)
├── Animation: Framer Motion 11.3 + GSAP 3.12 (ScrollTrigger)
├── Icons: Lucide React & React Icons
└── Notifications: Sonner

Backend, Auth & CMS:
├── ORM: Prisma ORM 7.9 with @prisma/adapter-pg
├── Authentication: Better Auth 1.6 (HTTP-only cookies, Session management)
├── Rich Text Editor: Tiptap 3 (ProseMirror with custom HTML5 video & YouTube nodes)
├── Media CDN: Cloudinary v2 SDK (Automated optimization & cache auto-purge)
└── Email Dispatch: Nodemailer 9 (Branded HTML templates with CID inline logo)

Database & AI Microservices:
├── Database: Supabase AWS ap-southeast-1 (PostgreSQL 15+)
├── Vector Search: pgvector extension (384-dimensional dense vectors)
├── Caching: Redis 7
├── AI Microservices: Python 3.11, FastAPI, Uvicorn
├── Embeddings: sentence-transformers/all-MiniLM-L6-v2
└── Reasoning LLM: Google Gemini REST API (gemini-flash-lite-latest, gemini-3.5-flash)
```

---

## 📁 Repository Structure

```
clickpoint-innovation/
├── apps/
│   └── ai/
│       ├── chat-service/          # FastAPI Chat & RAG Microservice (Port 8002)
│       │   ├── app/core/          # Intent detection & config
│       │   ├── app/retrieval/     # Candidate injection & pgvector search
│       │   └── app/llm/           # Prompts & Google Gemini provider
│       └── ingestion-service/     # FastAPI Vector Embeddings Service (Port 8001)
│           ├── app/sources/       # DB reader extracting 13 Prisma tables
│           └── app/indexer/       # SentenceTransformers embedding generator
├── docs/                          # Architecture & Developer Documentation
│   ├── FULL_WEBSITE_DEVELOPER_DOCUMENTATION.md
│   ├── CHATBOT_DEVELOPER_GUIDE.md
│   ├── clickpoint_full_website_developer_documentation.pdf
│   └── clickpoint_ai_chatbot_architecture.pdf
├── prisma/
│   ├── schema.prisma              # 28 Models, Enums, and Vector schemas
│   └── seed.ts                    # Production database seeder
├── public/
│   ├── docs/                      # Publicly accessible PDF & Markdown docs
│   └── images/                    # Brand assets & logos
├── scripts/
│   └── build_docs_pdf.js          # Automated PDF compiler from Markdown
├── src/
│   ├── app/                       # Next.js App Router (17 public & admin routes)
│   │   ├── (public)/              # About, Services, Blog, Careers, etc.
│   │   ├── admin/                 # Admin Login & Master CMS Dashboard
│   │   └── api/                   # 22 REST Route Handlers (/api/chat, /api/jobs, etc.)
│   ├── components/
│   │   ├── admin/                 # Tiptap editor, email composer, nav config
│   │   ├── common/                # Floating AI chatbot widget, enquiry modal
│   │   ├── layout/                # Responsive Navbar & Footer
│   │   ├── sections/              # 12 Modular landing page sections
│   │   └── ui/                    # Base Radix & Tailwind components
│   ├── lib/                       # Prisma client, Better Auth, Cloudinary, SSE bus, email
│   ├── server/actions/            # Server actions for atomic CMS mutations
│   └── middleware.ts              # Route protection & Better Auth session evaluation
├── docker-compose.prod.yml        # Production 5-container orchestration stack
├── package.json
└── tailwind.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

* **Node.js:** `v20.x` or higher
* **Package Manager:** `pnpm` (`v9.x` or `v12.x`)
* **Python:** `3.11+` (if running Python microservices locally outside Docker)
* **Docker & Docker Compose:** Optional for running the multi-container stack

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Bhaskar787/clickpoint-innovation.git
cd clickpoint-innovation
```

---

### Step 2: Install Dependencies

```bash
pnpm install
```

---

### Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Ensure the following core variables are configured:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.[id]:[pass]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[pass]@db.[id].supabase.co:5432/postgres"

# Authentication (Better Auth)
BETTER_AUTH_SECRET="your-secure-random-32-char-secret"
BETTER_AUTH_URL="http://localhost:3000"

# Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL_NAME="gemini-flash-lite-latest"

# Internal Microservices Key
INTERNAL_API_KEY="clickpoint-secret-internal-key-2026"
CHAT_SERVICE_URL="http://localhost:8002"
INGESTION_SERVICE_URL="http://localhost:8001"

# SMTP Email Dispatch
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

---

### Step 4: Push Database Schema & Seed Initial Content

```bash
# Push schema to Supabase PostgreSQL
npx prisma db push

# Seed initial singleton CMS records and admin account
pnpm db:seed
```

---

### Step 5: Start the Development Server

To run the Next.js frontend web app:
```bash
pnpm dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

To run all services concurrently (Web + Chat Service + Ingestion Service):
```bash
pnpm dev:all
```

---

## 🐳 Docker Production Deployment

You can deploy the complete production mesh using Docker Compose:

```bash
# Start all 5 production containers in the background
docker compose -f docker-compose.prod.yml up -d --build
```

#### Managed Containers & Port Mappings:
| Container Name | Service Description | Port Mapping |
| :--- | :--- | :--- |
| `clickpoint-web` | Next.js Production Web & Admin Application | `3001 -> 3000` |
| `clickpoint-chat-service` | FastAPI RAG Semantic Retrieval & Chat API | `8002 -> 8002` |
| `clickpoint-ingestion-service`| FastAPI Vector Embedding Pipeline | `8001 -> 8001` |
| `clickpoint-redis` | Redis Response Caching & Session Layer | `6380 -> 6379` |
| `clickpoint-postgres` | PostgreSQL with pgvector extension | `5433 -> 5432` |

---

## 📚 Developer Documentation & PDF Guides

Complete, in-depth technical documentation is included directly in this repository:

* **[Full Platform Architecture & Operations Manual (Markdown)](./docs/FULL_WEBSITE_DEVELOPER_DOCUMENTATION.md)**: 40+ pages covering the entire database ERD, 28 Prisma models, 17 routes, admin CMS workflows, ATS pipeline, SSE notification bus, and API gateway specifications.
* **[Full Platform Guide (PDF)](./public/docs/clickpoint_full_website_developer_documentation.pdf)**: Formatted, publication-grade executive PDF document.
* **[AI Chatbot Production Guide (Markdown)](./docs/CHATBOT_DEVELOPER_GUIDE.md)**: Deep dive into the RAG candidate injection engine, automatic CMS reindexing, and dual-mode Vercel fallback.
* **[Chatbot Architecture Guide (PDF)](./public/docs/clickpoint_ai_chatbot_architecture.pdf)**: Formatted PDF guide for the AI chatbot subsystem.

#### Recompiling Documentation PDFs:
To re-generate the PDF documentation at any time from the source Markdown files:
```bash
pnpm docs:pdf
```

---

## 🔒 Security & Verification

* **Pre-Commit Linting:** Enforced via Husky and lint-staged on every commit.
* **Type Safety:** Run full TypeScript verification:
  ```bash
  npx tsc --noEmit
  ```
* **ESLint Verification:** Run ESLint across all components:
  ```bash
  pnpm lint
  ```

---

## 📄 License & Maintainer

Maintained by **Bhaskar Budha** and the **Clickpoint Innovation Core Engineering Team**.  
Copyright © 2026 Clickpoint Innovation. All rights reserved.
