---
title: "LLM Word of the Week: Vibe Coding"
description: "Vibe coding — when you tell the AI what you want, accept whatever it gives you, and pray it works in prod."
img: /assets/llm/vibe-coding.png
img_alt: "Person sitting relaxed at a laptop while code flows out of a chat bubble"
publishDate: "2026-03-11"
author: "Ademola Arigbabuwo"
tags: ["AI", "LLM", "Vibe Coding", "Developer Tools"]
---

**Vibe Coding** is a software development practice where you describe what you want to build in natural language, let an LLM generate the code, and accept the output without deeply reviewing or understanding it. The goal is speed and flow — you're iterating by feel, not by comprehension.

---

## Where it came from (TL;DR)

The term was coined by Andrej Karpathy — co-founder of OpenAI and former AI leader at Tesla — in a post on X in February 2025. His original description characterized it as a state where a developer would "fully give in to the vibes, embrace exponentials, and forget that the code even exists." The post got over 4.5 million views and took over tech Twitter almost overnight. Merriam-Webster listed it as a "slang & trending" expression by March 2025, and it was named the Collins English Dictionary Word of the Year for 2025.

---

## Why vibe coding is different from AI-assisted coding

This is the most important disambiguation. Not all AI-assisted coding is vibe coding. Developer Simon Willison put it clearly: if an LLM wrote every line of your code but you've reviewed, tested, and understood it all, that's not vibe coding — that's using an LLM as a typing assistant.

The defining feature is **intentional non-review**. You're not just using AI to go faster — you're choosing to trust the output without fully understanding it. Karpathy described accepting all AI-generated code changes without reviewing diffs, pasting error messages directly back to the AI for resolution, and allowing the codebase to grow organically, potentially beyond the developer's full comprehension.

---

## Key things you should know

- **It was always meant for throwaway projects.** Karpathy framed it explicitly as something suited for prototypes and weekend experiments. The controversy came when the term started being applied to production codebases.

- **The security data is bad.** A December 2025 analysis of 470 open-source GitHub pull requests found that AI co-authored code contained roughly 1.7× more "major" issues compared to human-written code — with security vulnerabilities appearing at 2.74× the rate.

- **Even Karpathy has moved on.** In February 2026, Karpathy said vibe coding is now passé and introduced a new term: "agentic engineering" — where you're not writing code directly 99% of the time, but instead orchestrating agents who do, while you act as oversight. The shift reflects how much LLM capability improved in just one year.

---

## So — why should engineers and product leaders care now?

Because the term has already escaped its original meaning. In July 2025, the Wall Street Journal reported that vibe coding was being adopted by professional software engineers for commercial use cases — exactly the context Karpathy said it wasn't designed for. When a practice designed for weekend demos gets rebranded as a professional workflow, the risks multiply fast: undetected bugs, growing technical debt, and codebases no one on the team actually understands.

---

## Practical takeaways

1. **Know which mode you're in.** Vibe coding for a personal tool or prototype? Totally fine. Vibe coding for a system other people depend on? That's where it breaks down.
2. **Review what you ship.** If you can't explain how your code works to a teammate, you don't own it — your LLM does.
3. **Watch the "agentic engineering" shift.** That's the next term coming. Karpathy's reframe is a signal that the industry is maturing past blind acceptance toward structured AI-assisted development with real oversight.

---

## Final thought

Vibe coding isn't inherently reckless — it's context-dependent. The problem isn't using AI to build fast. The problem is forgetting that "it works on my machine" and "it's safe to ship" are two very different things. The vibes are real. So are the vulnerabilities.

*Originally published on [LinkedIn](https://www.linkedin.com/pulse/llm-word-week-vibe-coding-ademola-arigbabuwo-e6lzc/)*
