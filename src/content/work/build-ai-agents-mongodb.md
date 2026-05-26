---
title: "Building Smarter AI Agents with MongoDB"
description: "Notes from MongoDB Dev Day: using MongoDB's document model, Atlas Search, and vector search as a unified backbone for agent memory and RAG."
publishDate: 2026-05-20
tags:
  - mongodb
  - ai
  - agents
  - vector-search
  - memory
img: "/assets/mongo-dev-day-img.png"
img_alt: "Screenshot of MongoDB Dev Day"
---

Last week I attended [MongoDB Dev Day](https://landing.mdb.link/devday-chicago-26) here in Chicago, a two-day deep dive into modern data modeling, search, and building AI applications on MongoDB. Going in, I was curious about one thing in particular: **how well does MongoDB fit into agentic workflows?**

I left convinced that the document model is one of the most underrated primitives for building AI agents — especially when it comes to **agent memory**. This post is a recap of what I learned, with code examples, and a focused look at why MongoDB is a strong backbone for agent memory.

---

## Why MongoDB Clicks for AI Workflows

LLMs and agents naturally produce and consume **JSON-like, semi-structured data**. Tool calls, intermediate reasoning, plans, observations, and memory all tend to be hierarchical and shape-shifting. Traditional relational schemas force you to flatten, normalize, and translate that data on the way in and out.

MongoDB skips that impedance mismatch entirely:

- An LLM's output ≈ a MongoDB document.
- Schemas can evolve as your agent evolves.
- Vector embeddings live **alongside** the data they describe — no separate vector DB to sync.

That last point is the unlock for agent memory, which I'll get to. First, a quick walk through the foundations.

---

## Day 1: Data Modeling & Search Foundations

### Document Modeling: Embed vs. Reference

We built an online library app to explore the central tradeoff in document design: **embedding vs. referencing**.

Embedding keeps related data co-located so you avoid joins:

```json
// Embedded: a book with its reviews inline
{
  "_id": "book_123",
  "title": "The Pragmatic Programmer",
  "authors": ["Andy Hunt", "Dave Thomas"],
  "reviews": [
    { "user": "alice", "rating": 5, "text": "Classic." },
    { "user": "bob",   "rating": 4, "text": "Still relevant." }
  ]
}
```

This is great… until it isn't. If reviews grow unbounded, or are updated independently of the book, referencing is better:

```json
// Referenced
// books collection
{ "_id": "book_123", "title": "The Pragmatic Programmer" }

// reviews collection
{ "_id": "rev_1", "book_id": "book_123", "user": "alice", "rating": 5 }
{ "_id": "rev_2", "book_id": "book_123", "user": "bob",   "rating": 4 }
```

**Rule of thumb:** embed when data is read together and bounded in size; reference when data grows unbounded or is written independently.

### Search Fundamentals

MongoDB's Atlas Search gives you full-text search built into the database — no separate Elasticsearch cluster required. Highlights:

- Autocomplete, fuzzy search, filters, facets
- Multi-language support (40+ languages)
- Custom scoring, synonyms, highlighting, more-like-this

A simple fuzzy search aggregation:

```javascript
db.books.aggregate([
  {
    $search: {
      index: "default",
      text: {
        query: "pragmatik programer",
        path: ["title", "authors"],
        fuzzy: { maxEdits: 2 }
      }
    }
  },
  { $limit: 10 }
]);
```

We ended Day 1 by earning a skill badge — a nice way to validate everything hands-on.

---

## Day 2: Building AI Applications

### Vector Search + Auto Embeddings

The standout feature of Day 2 was MongoDB's **auto embedding** capability: embeddings are generated automatically when a document is inserted or updated, and they're stored **inside the document itself**.

That means no sync pipeline between your operational DB and your vector store. One source of truth.

A vector index definition:

```javascript
db.memories.createSearchIndex({
  name: "memory_vector_index",
  type: "vectorSearch",
  definition: {
    fields: [
      {
        type: "vector",
        path: "embedding",
        numDimensions: 1536,
        similarity: "cosine"
      },
      { type: "filter", path: "agent_id" },
      { type: "filter", path: "type" }
    ]
  }
});
```

And a vector search query, combining semantic similarity with metadata filters:

```javascript
db.memories.aggregate([
  {
    $vectorSearch: {
      index: "memory_vector_index",
      path: "embedding",
      queryVector: queryEmbedding, // produced by your embedding model
      numCandidates: 100,
      limit: 5,
      filter: {
        agent_id: "agent_42",
        type: "long_term"
      }
    }
  },
  {
    $project: {
      content: 1,
      type: 1,
      created_at: 1,
      score: { $meta: "vectorSearchScore" }
    }
  }
]);
```

This is the foundation for RAG — and, more interestingly, for agent memory.

---

## The Main Event: Agent Memory in MongoDB

Here's where MongoDB really shines. Most agent frameworks need three kinds of memory:

1. **Short-term memory** — the current conversation / scratchpad
2. **Long-term memory** — semantic recall across sessions
3. **Structured memory** — facts, preferences, entities

In a typical stack, that's three systems (Redis, a vector DB, a relational DB) glued together. In MongoDB, it's **one collection** with a flexible schema.

### A Unified Memory Document

```json
{
  "_id": "mem_9f2c",
  "agent_id": "agent_42",
  "session_id": "sess_1029",
  "type": "long_term",                  // short_term | long_term | fact
  "role": "user",                       // user | assistant | tool | system
  "content": "I prefer concise answers and code in TypeScript.",
  "metadata": {
    "source": "conversation",
    "importance": 0.82,
    "entities": ["user_preference", "language:typescript"]
  },
  "embedding": [0.0123, -0.0456, ...],  // auto-generated
  "created_at": "2025-01-15T14:32:11Z",
  "last_accessed": "2025-01-16T09:11:02Z"
}
```

One schema flexes to cover all three memory types. No migrations when the agent evolves.

### Writing Memories

Here's a simplified Python snippet for storing a memory. With auto embeddings configured, you don't even need to compute the vector yourself:

```python
from pymongo import MongoClient
from datetime import datetime

client = MongoClient(MONGO_URI)
memories = client.agents.memories

def remember(agent_id: str, session_id: str, content: str, mem_type: str):
    memories.insert_one({
        "agent_id": agent_id,
        "session_id": session_id,
        "type": mem_type,
        "content": content,                 # embedding auto-generated
        "created_at": datetime.utcnow(),
        "last_accessed": datetime.utcnow(),
    })

remember(
    agent_id="agent_42",
    session_id="sess_1029",
    content="User prefers concise answers and TypeScript code samples.",
    mem_type="long_term",
)
```

### Retrieving Memories

When the agent needs context, do a hybrid retrieval — recent short-term messages plus semantically relevant long-term memories:

```python
def recall(agent_id: str, session_id: str, query_embedding: list[float]):
    # Recent short-term context (last 10 turns)
    short_term = list(memories.find(
        {"agent_id": agent_id, "session_id": session_id, "type": "short_term"}
    ).sort("created_at", -1).limit(10))

    # Semantically relevant long-term memories
    long_term = list(memories.aggregate([
        {
            "$vectorSearch": {
                "index": "memory_vector_index",
                "path": "embedding",
                "queryVector": query_embedding,
                "numCandidates": 100,
                "limit": 5,
                "filter": {"agent_id": agent_id, "type": "long_term"}
            }
        },
        {"$project": {"content": 1, "score": {"$meta": "vectorSearchScore"}}}
    ]))

    return {"short_term": short_term, "long_term": long_term}
```

### Building the Prompt

Then fold both into your prompt:

```python
def build_prompt(user_msg: str, memory: dict) -> str:
    long_term = "\n".join(f"- {m['content']}" for m in memory["long_term"])
    short_term = "\n".join(f"{m['role']}: {m['content']}" for m in reversed(memory["short_term"]))

    return f"""You are a helpful assistant.

Relevant long-term memory about the user:
{long_term}

Recent conversation:
{short_term}

User: {user_msg}
Assistant:"""
```

That's a fully functional agent memory layer in one collection, one index, and a handful of queries.

### Bonus: Memory Decay & Reinforcement

Because each memory is just a document, you can model real cognitive patterns trivially. Boost importance on access:

```javascript
db.memories.updateOne(
  { _id: "mem_9f2c" },
  {
    $set: { last_accessed: new Date() },
    $inc: { "metadata.access_count": 1 }
  }
);
```

Or prune stale, low-importance memories on a schedule:

```javascript
db.memories.deleteMany({
  type: "short_term",
  created_at: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  "metadata.importance": { $lt: 0.3 }
});
```

Try doing that cleanly across three separate systems.

---

## Key Takeaways

- **The document model matches how agents think.** JSON in, JSON out, no translation layer.
- **Auto embeddings collapse the stack.** Your operational data and its vector representation live in the same document, updated atomically.
- **Agent memory becomes a single collection.** Short-term, long-term, and structured memory all fit one flexible schema — with hybrid retrieval in a single aggregation pipeline.
- **You can model real memory dynamics** (decay, reinforcement, importance) with plain MongoDB updates — no custom infrastructure.

If you're building agentic workflows, RAG systems, or anything where the data is fluid and the access patterns mix semantic + structured queries, MongoDB deserves a serious look. The fewer moving parts in your agent infrastructure, the more time you spend on the agent itself.

---

*Thanks to the MongoDB team for a great two days. If you want to dig in further, check out the [Data Modeling slides](https://docs.google.com/presentation/d/e/2PACX-1vTgafjeWGAz84Ts-96uAR18NMBgMJdHSBqaHqYIcB4OMATJ9Cz8IGMKJy4hAuMwxCXkr_Y8ERc6ve2Z/pub), [Search Fundamentals](https://docs.google.com/presentation/d/e/2PACX-1vREzt3j0xEOEslvqo3d1l0eppnkFBoKSHmMxPKXO_y3m-Wkyzx4WQjbQbuyzWjY8ZnTegxP1xiyeEO_/pub), and the [Vector Search lab](https://devdays-public-files.s3.us-east-1.amazonaws.com/Chicago+DevDays+2026/6.+Vector+Search+Lab+-+Chicago+2026.pdf).*