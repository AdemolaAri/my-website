---
title: "LLM Word of the Week: MCP / WebMCP"
description: "A practical mental model for Model Context Protocol (MCP) and WebMCP—why they matter and how they change how LLMs interact with tools, data, and the web."
publishDate: 2026-02-26
img: /assets/llm/mcp.png
imag_alt: "A diagram illustrating the concept of MCP, showing how an LLM connects to various tools and data sources through a structured protocol"
author: "Ademola Arigbabuwo"
tags: ["llm", "ai", "mcp", "webmcp", "agents", "tools"]
---

## LLM Word of the Week: MCP / WebMCP 🔌🌐

If prompts are *what* you ask, **context is *what the model can actually see***.

That’s where **MCP (Model Context Protocol)** comes in.

MCP is a standard way for tools, data sources, and environments to **expose context to an LLM**—not as raw prompts, but as structured, permissioned capabilities.

Think less *“paste everything into the prompt”*  
and more *“connect the model to the right systems.”*

---

## MCP (Model Context Protocol)

At a high level, MCP defines:
- **How tools describe themselves**
- **What data they expose**
- **How an LLM can safely request and use that data**

Instead of brittle prompt hacks, MCP enables:
- Discoverable tools
- Typed inputs/outputs
- Clear boundaries between model and system

The model doesn’t *guess* what it can do.  
It’s told—explicitly.

---

## WebMCP

**WebMCP** extends this idea to the web.

It allows websites and services to:
- Declare what actions are allowed
- Define what data is readable or writable
- Control how LLMs interact with them

Less scraping.  
Less hallucinated APIs.  
More **contract-driven interaction**.

---

## Why This Matters

MCP shifts LLMs from:
> “Smart text generators”

to:
> “Reliable system participants”

This unlocks:
- Safer [agentic](/work/llm-word-of-the-week/agents) workflows
- More trustworthy tool usage
- Clearer debugging when things go wrong
- Better separation of **model logic vs system logic**

For engineers, it’s the difference between:
- Prompt spaghetti 🍝  
- And real interfaces

---

## Mental Model

- [Prompts](/work/llm-word-of-the-week/prompt) → instructions  
- [Context](/work/llm-word-of-the-week/context-window) → capabilities  
- **MCP** → the wiring

LLMs don’t become powerful by knowing more words.  
They become powerful by being connected—*correctly*.

---

*LLM Word of the Week is a weekly series breaking down one concept that quietly shapes how modern AI systems actually work.*
