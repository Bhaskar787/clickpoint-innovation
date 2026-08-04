import { FaqItem } from "@/types";

// Fallback content shown when the `faqs` DB table has no rows yet.
// The admin dashboard can add/edit/reorder FAQs which are then read live from the DB.
export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "pod-speed",
    question: "How fast can Clickpoint kick off a new engineering pod?",
    answer:
      "We can onboard and deploy a dedicated engineering pod within 3 to 5 business days following technical scope alignment.",
    categoryId: "cat-engineering-stack",
    category: "Engineering & Stack",
    order: 0,
  },
  {
    id: "nda-security",
    question: "Do you sign NDAs before initial technical discovery calls?",
    answer:
      "Yes. We execute a standard mutual Non-Disclosure Agreement (NDA) before reviewing proprietary code, architectures, or data models.",
    categoryId: "cat-security-ndas",
    category: "Security & NDAs",
    order: 1,
  },
  {
    id: "billing-models",
    question: "What engagement and billing models do you offer?",
    answer:
      "We offer both Fixed-Scope Milestone SOWs for defined deliverables and Dedicated Monthly Pods for continuous product scaling.",
    categoryId: "cat-pricing-billing-models",
    category: "Pricing & Billing Models",
    order: 2,
  },
  {
    id: "ip-ownership",
    question: "Who owns the IP and source code developed by Clickpoint?",
    answer:
      "You retain 100% full intellectual property (IP), source code repository, and patent ownership upon project delivery.",
    categoryId: "cat-security-ndas",
    category: "Security & NDAs",
    order: 3,
  },
  {
    id: "post-launch-sla",
    question: "Do you provide post-launch maintenance & SLA support?",
    answer:
      "Yes. We offer 24/7 SLA monitoring, zero-downtime cloud maintenance, and ongoing feature enhancement retainers.",
    categoryId: "cat-support-maintenance",
    category: "Support & Maintenance",
    order: 4,
  },
  {
    id: "ai-hallucinations",
    question: "How do you prevent AI model hallucinations in production apps?",
    answer:
      "We implement Retrieval-Augmented Generation (RAG) with PgVector / Pinecone vector indexes, confidence score evaluation guards, and deterministic fallback logic.",
    categoryId: "cat-ai-integration-copilots",
    category: "AI Integration & Copilots",
    order: 5,
  },
  {
    id: "tech-stack-flexibility",
    question: "Can Clickpoint work with our existing codebase and cloud infrastructure?",
    answer:
      "Absolutely. Our engineers specialize in React, Next.js, Node.js, Python, PostgreSQL, AWS, GCP, and Kubernetes integrations.",
    categoryId: "cat-engineering-stack",
    category: "Engineering & Stack",
    order: 6,
  },
  {
    id: "hipaa-pci-compliance",
    question: "Are your software engineering practices HIPAA and PCI-DSS compliant?",
    answer:
      "Yes. We design zero-trust data architectures with end-to-end encryption, automated security vulnerability scanning, and tenant data isolation.",
    categoryId: "cat-security-ndas",
    category: "Security & NDAs",
    order: 7,
  },
  {
    id: "team-timezones",
    question: "How do you handle team communication across timezones?",
    answer:
      "We operate distributed delivery hubs across 3 timezones (US, Europe, APAC) providing continuous 24/7 engineering coverage with daily Slack and GitHub updates.",
    categoryId: "cat-support-maintenance",
    category: "Support & Maintenance",
    order: 8,
  },
  {
    id: "fixed-price-guarantee",
    question: "Are there any hidden fees in Fixed-Scope SOW contracts?",
    answer:
      "No. Our Fixed-Scope SOW contracts include clear milestone deliverables, sprint schedules, and guaranteed cost caps with zero surprise fees.",
    categoryId: "cat-pricing-billing-models",
    category: "Pricing & Billing Models",
    order: 9,
  },
  {
    id: "llm-fine-tuning",
    question: "Do you fine-tune open-source AI models (Llama 3 / Mistral) for enterprise clients?",
    answer:
      "Yes. We fine-tune custom open-source models using LoRA / QLoRA on domain datasets to achieve enterprise privacy and domain accuracy.",
    categoryId: "cat-ai-integration-copilots",
    category: "AI Integration & Copilots",
    order: 10,
  },
  {
    id: "code-quality-audits",
    question: "Do you provide code quality and security audit reviews for existing apps?",
    answer:
      "Yes. Our senior architects perform comprehensive code reviews, performance bottleneck analysis, and security vulnerability audits.",
    categoryId: "cat-engineering-stack",
    category: "Engineering & Stack",
    order: 11,
  },
];
