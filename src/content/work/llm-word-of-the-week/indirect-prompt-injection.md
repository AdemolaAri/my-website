---
title: "LLM Word of the Week: Indirect Prompt Injection"
description: "When the hacker doesn't attack you. They attack the website your AI agent reads. Then the website attacks you."
img: "/assets/llm/indirect-prompt-injection.png"
img_alt: "A spider web overlaid on a browser window with hidden text glowing inside a webpage"
publishDate: "2026-04-21"
author: "Ademola Arigbabuwo"
tags: ["AI", "LLM", "Security", "Prompt Injection", "AI Agents"]
---

**Indirect Prompt Injection** is a cyberattack where malicious instructions are hidden inside content an AI reads — a webpage, a PDF, an email, a document — rather than typed directly by the attacker. The AI processes the content, encounters the hidden instructions, and follows them as if they came from the user or the system. You never typed anything malicious. The damage happens anyway.

---

## Why this is different from regular prompt injection

You may have heard of **prompt injection** — the broader category where an attacker crafts inputs to override an AI's instructions. Think of it as the AI equivalent of SQL injection: exploiting the fact that the model can't reliably distinguish between *trusted instructions* and *untrusted data* when they arrive in the same context.

Direct prompt injection occurs when an attacker places malicious instructions directly into the agent's input channel — like a chat interface — explicitly attempting to override the agent's behavior. Indirect prompt injection hides those instructions within external content that the agent later processes: web pages, emails, or documents.

The difference is critical. Direct injection requires the attacker to have access to your interface. Indirect injection requires only that your AI agent *reads something the attacker controls* — a website, a public document, a poisoned email. In 2024, security was about the "visible punch" — the user typing "ignore previous instructions." In 2026, the user is no longer the attacker. The user is the victim.

---

## How hacked websites fit in

Browsers summarizing webpages have been tricked into leaking credentials. Copilots have taken actions based on poisoned emails or metadata. Agentic tools have executed attacker-controlled commands after reading compromised documentation.

The attack is remarkably simple in practice. Hidden in a website can be white text on a white background, instructing the AI to forward messages to all contacts. Any content an agent can read is a potential injection surface — web pages, PDFs, emails, code comments, and database content.

Microsoft Security documented a real case where a Google Gemini Calendar invite containing hostile instructions caused Gemini to parse them as context when answering completely innocuous questions — the attack came in through a calendar invite, not through any user-facing prompt.

---

## Why it's so dangerous in the agentic era

Indirect prompt injection has always existed as a concept. What changed is **what AI agents can now do**. We are no longer talking about tricking a chatbot into saying something rude. We are talking about exfiltrating private data, executing unauthorized actions, and compromising entire systems through a few carefully crafted words.

An AI agent is not just a language model answering questions. It is a system that can read untrusted content, call tools, use credentials, store state, and take actions. That combination turns ordinary application security mistakes into amplified failures.

The blast radius grows with every new capability you give an agent. An agent that can only answer questions? Low stakes. An agent that can browse the web, read your emails, write files, and call APIs? A single poisoned webpage can now set off a chain reaction across your entire system.

---

## Key things you should know

- **It's OWASP's #1 LLM vulnerability.** Prompt injection vulnerabilities appear in 73% of production AI deployments. OpenAI has publicly called it a "frontier security challenge" with no clean solution.

- **It's not fixable with better prompts.** Indirect prompt injection is not a jailbreak and not fixable with prompts or model tuning. It's a system-level vulnerability created by blending trusted and untrusted inputs in one context window.

- **More capable models are paradoxically more vulnerable.** Analysis revealed that all evaluated LLMs exhibit vulnerability to indirect prompt injection attacks, with more capable models showing higher attack success rates — because smarter models are better at following instructions, including the ones they shouldn't.

---

## Practical takeaways

1. **Treat all external content as untrusted.** If your agent reads a webpage, a PDF, or an email, assume that content could contain adversarial instructions. Sanitize and isolate it before it reaches the model's context.
2. **Limit what your agents can do.** Principle of least privilege applies directly here. An agent that can only read and summarize is much safer than one that can read, write, send, and execute. Expand permissions only when necessary.
3. **Design for containment, not just prevention.** You can't filter every injection attempt. Build your system assuming some will get through: add approval gates for high-impact actions, scope credentials tightly, and log agent reasoning so anomalies are visible.
4. **Audit what your AI agents browse.** If you're building a RAG system or a browsing agent, audit the data sources it accesses. A poisoned document sitting quietly in your knowledge base is an attack waiting for the right trigger query.

---

## Final thought

Indirect prompt injection is what happens when you give an AI eyes, hands, and access to the internet — and forget that not everything it reads is friendly. The attack surface is no longer your chat interface. It's every webpage, document, and data source your AI agent will ever touch. In 2026, securing your AI means securing everything it reads.
