---
title: "LLM Word of the Week: Agents"
description: "A clear, practical breakdown of what AI agents are, how they work, and why they represent a shift from language models that talk to systems that act."
publishDate: 2026-01-08
img: /assets/llm/agents.png
imag_alt: "A visual representation of an AI brain interacting with various tools and systems to accomplish tasks"
author: "Ademola Arigbabuwo"
tags: ["llm", "ai", "agents", "autonomous systems", "language models"]
---

## LLM Word of the Week: Agents

**Agents** are a type of AI system that can *take actions* on your behalf — not just answer questions.

While most interactions with LLMs are like asking a really smart assistant to *talk*, agents actually *do things*: they plan, make decisions, execute tools, and adapt based on results.

You could think of them as “AI workers” rather than just language responders.

---

## What an agent does (TL;DR)

A traditional LLM-based chat answers your prompt by generating text.  
An **agent** accepts your goal *and then takes steps autonomously* to achieve it, using multiple tools and sub-steps.

For example:
- You ask: “Book me a flight to Seattle next Tuesday under $350.”
- A plain LLM can draft text that *looks like* an answer.
- An agent can actually:
  1. Search flight APIs
  2. Compare prices
  3. Evaluate constraints (dates / budget)
  4. Present the best option  

All without you breaking it into micro-prompts.

Agents combine planning, tool use, environment interaction, and iterative reasoning.

---

## Why agents are different from basic prompts

Most LLMs do:  
**Input → Response**

Agents do:  
**Goal → Plan → Actions → Observation → Next Action → Repeat → Final Result**

This loop allows agents to behave more like software systems and less like static autocomplete engines.

---

## A simple analogy

Think of a standard LLM like a skilled chef who answers:  
*“How do I bake a pie?”*

An agent is the chef who actually bakes it:
- Checks the pantry
- Preheats the oven
- Adjusts timing based on results
- Serves the finished dish

Both understand language — only one executes.

---

## Core components of an agent

Most agents are built from a few key parts:

- **Planner** – breaks a goal into steps
- **Executor** – performs actions using tools (APIs, search, code, databases)
- **Feedback loop** – evaluates results and decides next steps
- **State / memory** – tracks progress across actions

Together, these enable autonomy and adaptability.

---

## Why agents matter now

Agents represent a shift in how AI is used:

- They orchestrate actions across systems, not just text.
- They reduce the need for step-by-step human prompting.
- They enable workflows like scheduling, research, debugging, and automation.

In short: agents move AI from *conversation* to *coordination*.

---

## Key risks and considerations

Agents introduce new challenges:

- **Safety** – actions can have real-world consequences
- **Correctness** – misunderstood goals can lead to errors
- **Oversight** – guardrails and human review remain critical

Well-designed agents treat LLM outputs as plans, not unquestioned commands.

---

## Final thought

If traditional LLMs are conversational partners,  
**agents are collaborative workers**.

They don’t just respond to prompts —  
they pursue goals.

And that distinction is shaping the next phase of AI systems.
