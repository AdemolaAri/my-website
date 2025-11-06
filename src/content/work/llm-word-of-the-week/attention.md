---
title: "LLM Word of the Week: Attention"
description: "Attention is the core idea that changed AI forever. It’s how large language models decide what to focus on."
img: /assets/attention.png
imag_alt: "A visual illustration showing how “attention” helps AI models focus on specific words in a sentence"
publishDate: 2025-11-05
author: "Ademola Arigbabuwo"
tags: ["LLM", "AI", "AttentionMechanism", "Transformers"]
---

# LLM Word of the Week: Attention

**How models decide which words matter — and why it changed everything.**

---

## Before “Attention”: How NLP used to work

Before transformers, natural language processing (NLP) relied mostly on *sequential* models like RNNs (Recurrent Neural Networks) and LSTMs (Long Short-Term Memory networks).  
These models processed text word-by-word, predicting the **next word** based only on the previous few words — a bit like finishing a sentence without remembering the paragraph before it.

They worked, but struggled with long-term [context](/work/llm-word-of-the-week/context-window/). The further away a word was, the less influence it had. That’s why models often lost the thread in long sentences or documents.

---

## What “Attention” really means

In the world of large language models, **attention** is the mechanism that lets a model “look at” different words (or tokens) and decide which ones are important as it generates a response.

Instead of processing text strictly in order, the model uses attention to **weigh relationships across the entire input** — allowing it to capture long‑range dependencies and subtle context.  
(Source: [Introduction to Transformers and Attention Mechanisms](https://medium.com/%40kalra.rakshit/introduction-to-transformers-and-attention-mechanisms-c29d252ea2c5))

---

## Why attention was the breakthrough

The 2017 paper *[Attention Is All You Need](https://arxiv.org/abs/1706.03762)* by Vaswani et al. introduced the **Transformer Architecture** — a model built entirely on attention (no recurrence or convolution).

Because of attention:
- Models can analyze **all parts** of a sentence simultaneously.
- Each [token](/work/llm-word-of-the-week/tokens/) can decide how much influence other [tokens](/work/llm-word-of-the-week/tokens/) have (via *queries, keys,* and *values*).
- Training became massively parallelizable and scalable.

This idea powered everything from GPT to Gemini — it’s what made generative AI possible.

---

## Why it matters for you

- When you prompt an AI and it “gets the context” (even if key info was 50 words back), that’s attention at work.
- It means models aren’t just “remembering recent text” — they’re reasoning across the full input.
- It shapes how you should write prompts, structure context, and design systems.

---

## Simple analogy

Think of reading a novel with many characters.  
Without attention, the model reads linearly and forgets details from earlier chapters.  
With attention, it’s like giving the model a board of sticky notes — it can look back at key moments and see how they connect to the current scene.

---

## Final thought

If the architecture of modern LLMs is the house, **attention is the wiring that connects every room**.  
It’s the reason models can go beyond predicting words — to actually understanding relationships.

