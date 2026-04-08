# LeetCode Interview Cheatsheet

> **Source:** [LeetCode Cheatsheets - Resources](https://leetcode.com/explore/interview/card/cheatsheets/720/resources/4725/)  
> **Purpose:** Quick reference for DSA interview preparation and React app integration.

---

## Table of Contents

1. [Time Complexity (Big O) Cheat Sheet](#time-complexity-big-o-cheat-sheet)
   - [Arrays (Dynamic Array/List)](#arrays-dynamic-arraylist)
   - [Strings (Immutable)](#strings-immutable)
   - [Linked Lists](#linked-lists)
   - [Hash Table / Dictionary](#hash-table--dictionary)
   - [Set](#set)
   - [Stack](#stack)
   - [Queue](#queue)
   - [Binary Tree (DFS/BFS)](#binary-tree-dfsbfs)
   - [Binary Search Tree (BST)](#binary-search-tree-bst)
   - [Heap / Priority Queue](#heap--priority-queue)
   - [Binary Search](#binary-search)
   - [Miscellaneous](#miscellaneous)
2. [Input Size vs Time Complexity](#input-size-vs-time-complexity)
3. [Sorting Algorithms](#sorting-algorithms)
4. [General DS/A Flowchart](#general-dsa-flowchart)
5. [Interview Stages Cheat Sheet](#interview-stages-cheat-sheet)

---

## Time Complexity (Big O) Cheat Sheet

### Arrays (Dynamic Array/List)

> Given `n = arr.length`

| Operation | Time Complexity |
|---|---|
| Add or remove element at the **end** | O(1) amortized |
| Add or remove element at **arbitrary index** | O(n) |
| Access or modify element at arbitrary index | O(1) |
| Check if element exists | O(n) |
| Two pointers | O(n · k) where k = work per iteration |
| Building a prefix sum | O(n) |
| Finding sum of subarray (given prefix sum) | O(1) |

---

### Strings (Immutable)

> Given `n = s.length`

| Operation | Time Complexity |
|---|---|
| Add or remove character | O(n) |
| Access element at arbitrary index | O(1) |
| Concatenation of two strings | O(n + m) where m = length of other string |
| Create substring | O(m) where m = length of substring |
| Two pointers / Sliding window | O(n · k) where k = work per iteration |
| Build string from array / StringBuilder | O(n) |

---

### Linked Lists

> Given `n` = number of nodes

| Operation | Time Complexity |
|---|---|
| Add/remove given pointer **before** location | O(1) |
| Add/remove given pointer **at** location (doubly linked) | O(1) |
| Add/remove at arbitrary position without pointer | O(n) |
| Access element at arbitrary position without pointer | O(n) |
| Check if element exists | O(n) |
| Reverse between positions i and j | O(j - i) |
| Detect a cycle | O(n) — fast-slow pointers or hash map |

---

### Hash Table / Dictionary

> Given `n = dic.length`

| Operation | Time Complexity |
|---|---|
| Add or remove key-value pair | O(1) |
| Check if key exists | O(1) |
| Check if value exists | O(n) |
| Access or modify value by key | O(1) |
| Iterate over all keys, values, or both | O(n) |

> **Note:** O(1) operations are constant relative to n. If keys are strings, hashing costs O(m) where m = string length.

---

### Set

> Given `n = set.length`

| Operation | Time Complexity |
|---|---|
| Add or remove element | O(1) |
| Check if element exists | O(1) |

> Same note applies as hash maps regarding string keys.

---

### Stack

> Implemented with a dynamic array. Given `n = stack.length`

| Operation | Time Complexity |
|---|---|
| Push element | O(1) |
| Pop element | O(1) |
| Peek (top of stack) | O(1) |
| Access or modify element at arbitrary index | O(1) |
| Check if element exists | O(n) |

---

### Queue

> Implemented with a doubly linked list. Given `n = queue.length`

| Operation | Time Complexity |
|---|---|
| Enqueue element | O(1) |
| Dequeue element | O(1) |
| Peek (front of queue) | O(1) |
| Access or modify element at arbitrary index | O(n) |
| Check if element exists | O(n) |

> **Note:** Most languages implement queues more sophisticatedly; index access may be faster than O(n).

---

### Binary Tree (DFS/BFS)

> Given `n` = number of nodes

- Most algorithms run in **O(n · k)**, where k = work done at each node (usually O(1)).
- Assumes BFS is implemented with an efficient queue.

---

### Binary Search Tree (BST)

> Given `n` = number of nodes

| Operation | Average Case | Worst Case |
|---|---|---|
| Add or remove element | O(log n) | O(n) |
| Check if element exists | O(log n) | O(n) |

> Average case assumes a **well-balanced** tree. Worst case is a degenerate (linear chain) tree.

---

### Heap / Priority Queue

> Given `n = heap.length` (min heap)

| Operation | Time Complexity |
|---|---|
| Add an element | O(log n) |
| Delete the minimum element | O(log n) |
| Find the minimum element | O(1) |
| Check if element exists | O(n) |

---

### Binary Search

| Operation | Time Complexity |
|---|---|
| Binary search | O(log n) where n = initial search space size |

---

### Miscellaneous

| Algorithm | Time Complexity | Space Complexity |
|---|---|---|
| Sorting | O(n · log n) | — |
| DFS / BFS on a graph | O(n · k + e) | O(n) or O(n + e) |
| Dynamic Programming | O(n · k) where n = states, k = work per state | O(n) |

> e = number of edges, k = work done at each node (excluding edge iteration)

---

## Input Size vs Time Complexity

| Input Size (n) | Expected Time Complexity | Strategy |
|---|---|---|
| n ≤ 10 | O(n² · n!) or O(4ⁿ) | Brute force / backtracking |
| 10 < n ≤ 20 | O(2ⁿ) | Subsets / subsequences, backtracking |
| 20 < n ≤ 100 | O(n³) | Nested loops, optimize slow steps with hash maps / heaps |
| 100 < n ≤ 1,000 | O(n²) | Nested loops (quadratic usually expected) |
| 1,000 < n ≤ 100,000 | O(n · log n) or O(n) | Sorting, heap, sliding window, monotonic stack, binary search |
| 100,000 < n ≤ 1,000,000 | O(n) | Hash maps, linear scan |
| n > 1,000,000 | O(log n) or O(1) | Binary search, math tricks |

### Techniques for O(n · log n) → O(n) Range (n ≤ 10⁵)

When nested loops (O(n²)) are unacceptable, use one of:
- Hash map
- Two pointers / Sliding window
- Monotonic stack
- Binary search
- Heap
- A combination of the above

---

## Sorting Algorithms

> All major languages have built-in sort — typically **O(n · log n)**.  
> Example: Python uses **Timsort**; C++ implementation varies by compiler.

| Algorithm | Best | Average | Worst | Stable? | Space |
|---|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | ✅ Yes | O(1) |
| Selection Sort | O(n²) | O(n²) | O(n²) | ❌ No | O(1) |
| Insertion Sort | O(n) | O(n²) | O(n²) | ✅ Yes | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | ✅ Yes | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | ❌ No | O(log n) |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | ❌ No | O(1) |
| Tim Sort | O(n) | O(n log n) | O(n log n) | ✅ Yes | O(n) |
| Counting Sort | O(n + k) | O(n + k) | O(n + k) | ✅ Yes | O(k) |
| Radix Sort | O(nk) | O(nk) | O(nk) | ✅ Yes | O(n + k) |

> **Stable sort** = maintains relative order of records with equal keys.

---

## General DS/A Flowchart

Use this guide to decide **which data structure or algorithm** to use:

```
Is the problem about...
│
├── Searching / Lookup?
│   ├── Unordered data          → Hash Map / Set
│   ├── Sorted data             → Binary Search
│   └── Tree structure          → BST / Trie
│
├── Ordering / Ranking?
│   ├── Top K elements          → Heap / Priority Queue
│   └── Full sort needed        → Sort algorithm
│
├── Sequences / Subarrays?
│   ├── Contiguous subarray     → Sliding Window
│   ├── Prefix relationships    → Prefix Sum + Hash Map
│   └── Next greater/smaller    → Monotonic Stack
│
├── Graphs / Connectivity?
│   ├── Shortest path           → BFS (unweighted) / Dijkstra (weighted)
│   ├── All paths / cycles      → DFS
│   └── Components              → Union-Find
│
├── Optimization / Counting?
│   ├── Overlapping subproblems → Dynamic Programming
│   └── Exhaustive search       → Backtracking / Recursion
│
└── Two-way traversal?
    └── Sorted / partitioned    → Two Pointers
```

---

## Interview Stages Cheat Sheet

### Stage 1: Introductions
- Have a rehearsed **30–60 second intro** covering education, work experience, and interests.
- Smile, speak with confidence.
- Listen when interviewer talks about themselves; reference their work in your questions later.

---

### Stage 2: Problem Statement
- **Paraphrase** the problem back to the interviewer.
- Ask clarifying questions: expected input size, edge cases, invalid inputs.
- Walk through an example test case to confirm understanding.

---

### Stage 3: Brainstorming DS&A
- Always **think out loud**.
- Break the problem down → identify the bottleneck → pick the right DS/A with good time complexity.
- Be receptive to hints from the interviewer.
- Before coding, **explain your approach** and get buy-in from the interviewer.

---

### Stage 4: Implementation
- Explain decision-making as you code (e.g., why you chose a set).
- Write **clean code** following language conventions.
- Avoid duplicate code — use helper functions.
- Don't panic if stuck — communicate with your interviewer.
- Start with brute force if needed, then optimize.

---

### Stage 5: Testing & Debugging
- Walk through test cases, tracking variables manually at the bottom of the file.
- Condense trivial steps (e.g., prefix sum creation) to save time.
- Use print statements in code if the environment supports running it.
- Stay vocal throughout; keep communicating.

---

### Stage 6: Explanations & Follow-ups

Be prepared to answer:
- **Time and space complexity** (average and worst case)
- **Why** you chose this data structure / algorithm / logic
- **Can it be improved?** (If asked, the answer is usually yes — especially if solution is slower than O(n))

---

### Stage 7: Outro
- Have **questions about the company** ready.
- Be interested, smile, and ask follow-up questions to the interviewer's responses.

---

## React App Integration Notes

This cheatsheet is intended to be used as the data/content layer for a React application. Suggested component structure:

```
src/
├── App.jsx
├── components/
│   ├── Navbar.jsx
│   ├── TableOfContents.jsx
│   ├── BigOTable.jsx          # Complexity tables per data structure
│   ├── InputSizeTable.jsx     # n vs complexity guide
│   ├── SortingTable.jsx       # Sorting algorithms comparison
│   ├── DSAFlowchart.jsx       # Visual flowchart
│   └── InterviewStages.jsx    # Stage-by-stage interview guide
├── data/
│   └── cheatsheet.js          # All structured data (arrays, objects)
└── styles/
    └── index.css
```

### Suggested Libraries
- **React Router** — for navigating between sections
- **react-syntax-highlighter** — for code blocks
- **recharts / mermaid** — for rendering the DS/A flowchart visually
- **tailwindcss** — for responsive styling

---

*Last updated: April 4, 2026 | Source: LeetCode Explore Cheatsheets*
