---
title: "LLM Word of the Week: RAG"
description: "RAG — when LLMs don’t just “know,” they also go look up info to give better answers."
img: /assets/LLMWOTW-RAG.png
publishDate: 2025-10-01
author: "Ademola Arigbabuwo"
tags: ["LLM", "AI", "RAG", "Retrieval-Augmented Generation"]
---

# LLM Word of the Week: RAG  
**RAG — when LLMs don’t just “know,” they also *go look up* info to give better answers.**

RAG (Retrieval‑Augmented Generation) is a technique where an LLM can fetch relevant external information (from a database, document store, or knowledge source) and use that to generate more accurate, up-to-date responses.

---

## What RAG does (TL;DR)  
Instead of relying solely on its internal “memory,” a model with RAG **retrieves** external documents or facts, then **generates** a response grounded in that retrieval. This combination reduces hallucination, allows updates without full retraining, and supports domain-specific systems.

---

## Why RAG changes the game  
Plain LLMs are limited by their training cutoff and internal weights. With RAG:

- Errors from out-of-date knowledge drop dramatically  
- You can plug in your own documents, internal knowledge base, or domain-specific sources  
- It scales—you're not retraining the entire model every time your data changes  

---

## Key components & design choices  
- **Retriever / index**: The system that finds relevant docs (vector search, sparse search, hybrid)  
- **Prompt / generator**: The LLM that uses retrieved documents + your question to build an answer  
- **Re-ranking or filtering**: Often you filter or rerank retrieved results so the LLM only sees high-quality evidence  
- **When to retrieve**: Some architectures decide “should I fetch documents or just trust the model?” (adaptive / conditional retrieval)  

---

## Trade-offs & challenges  
- Blending retrieval and generation introduces latency and complexity  
- Retrieval errors or missing docs can still lead to hallucinated output  
- If the retriever is weak, the generator may “hallucinate filler”  
- Maintaining and indexing large document stores is resource-intensive  

---

## Putting it into practice (tips)  
1. Start with a solid vector search system (FAISS, Pinecone, Weaviate)  
2. Use prompt engineering to condition the model to cite or incorporate retrieved context  
3. Monitor hallucination by comparing generated claims against retrieved evidence  
4. Experiment with *adaptive retrieval* — only fetch when necessary  
5. When adding new data, update indexes frequently rather than retraining model  

---

## Final thought  
RAG bridges memory and reasoning: it lets models say, “I don’t know, but I’ll find the answer.” In doing so, it significantly reduces the burden on models to internalize everything, while giving them grounded context to reason from.    

See this notebook for an example implementation of RAG: https://www.kaggle.com/code/princedemo/using-rag-to-improve-prompt-response