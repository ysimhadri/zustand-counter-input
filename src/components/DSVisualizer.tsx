import { useState } from 'react'
import './DSVisualizer.css'

type Tab = 'array' | 'stack' | 'queue' | 'linkedlist' | 'bst' | 'hashmap'

const TABS: { id: Tab; label: string; complexity: string }[] = [
  { id: 'array',      label: 'Array',       complexity: 'Access O(1) · Insert O(n)' },
  { id: 'stack',      label: 'Stack',       complexity: 'Push/Pop O(1)' },
  { id: 'queue',      label: 'Queue',       complexity: 'Enqueue/Dequeue O(1)' },
  { id: 'linkedlist', label: 'Linked List', complexity: 'Insert O(1) · Search O(n)' },
  { id: 'bst',        label: 'BST',         complexity: 'Insert/Search O(log n) avg' },
  { id: 'hashmap',    label: 'Hash Map',    complexity: 'Get/Set O(1) avg' },
]

// ─── Syntax highlighter ───────────────────────────────────────────────────────
function highlight(raw: string): string {
  const escaped = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped
    .replace(/(\/\/[^\n]*)/g,        '<span class="sh-c">$1</span>')
    .replace(/\b(class|const|let|var|function|return|if|else|while|for|of|in|new|this|public|private|readonly|null|undefined|true|false|void|import|export|type|interface|extends|implements|static)\b/g,
                                      '<span class="sh-kw">$1</span>')
    .replace(/\b(number|string|boolean|any|never|unknown|T|Array|Map|Set)\b/g,
                                      '<span class="sh-ty">$1</span>')
    .replace(/'([^']*)'/g,           '<span class="sh-s">\'$1\'</span>')
    .replace(/\b(\d+)\b/g,           '<span class="sh-n">$1</span>')
}

// ─── Code block component ─────────────────────────────────────────────────────
function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      className="ds-code"
      dangerouslySetInnerHTML={{ __html: highlight(code) }}
    />
  )
}

// ─── Code snippets ────────────────────────────────────────────────────────────
const CODE: Record<Tab, string> = {
  array: `// ── Array (built-in JavaScript / TypeScript) ────────────────────────

const arr: number[] = [10, 20, 30];

// ── Add / Remove ────────────────────────────────── Complexity
arr.push(40);                    // add to end          O(1)
arr.pop();                       // remove from end     O(1)
arr.unshift(5);                  // add to front        O(n)
arr.shift();                     // remove from front   O(n)
arr.splice(2, 0, 99);            // insert at index 2   O(n)
arr.splice(2, 1);                // delete at index 2   O(n)

// ── Access / Search ─────────────────────────────────────────
arr[0];                          // index access        O(1)
arr.indexOf(20);                 // first index of val  O(n)
arr.lastIndexOf(20);             // last index of val   O(n)
arr.includes(20);                // existence check     O(n)
arr.find(x => x > 15);          // first match         O(n)
arr.findIndex(x => x > 15);     // index of match      O(n)

// ── Transform ────────────────────────────────────────────────
arr.map(x => x * 2);            // new transformed arr O(n)
arr.filter(x => x > 10);        // new filtered arr    O(n)
arr.reduce((acc, x) => acc + x, 0); // fold to value  O(n)
arr.flatMap(x => [x, x * 2]);   // map then flatten    O(n)

// ── Iteration ────────────────────────────────────────────────
arr.forEach(x => console.log(x));   // iterate         O(n)
for (const x of arr) { }            // for-of loop     O(n)

// ── Sort / Slice / Rearrange ──────────────────────────────────
arr.sort((a, b) => a - b);      // sort ascending      O(n log n)
arr.sort((a, b) => b - a);      // sort descending     O(n log n)
arr.slice(1, 3);                 // subarray [1,3)      O(k)
arr.reverse();                   // reverse in-place    O(n)
arr.concat([40, 50]);            // merge arrays        O(n+m)
[...new Set(arr)];               // remove duplicates   O(n)

// ── Info ──────────────────────────────────────────────────────
arr.length;                      // size                O(1)
arr.every(x => x > 0);          // all match pred?     O(n)
arr.some(x => x > 15);          // any match pred?     O(n)`,

  stack: `// ── Stack  (Last In First Out — LIFO) ───────────────────────────

class Stack<T> {
  private items: T[] = [];

  push(item: T): void {          // add to top          O(1)
    this.items.push(item);
  }
  pop(): T | undefined {         // remove from top     O(1)
    return this.items.pop();
  }
  peek(): T | undefined {        // view top (no remove)O(1)
    return this.items[this.items.length - 1];
  }
  isEmpty(): boolean {           // check if empty      O(1)
    return this.items.length === 0;
  }
  size(): number {               // number of elements  O(1)
    return this.items.length;
  }
  clear(): void {                // remove all          O(1)
    this.items = [];
  }
  toArray(): T[] {               // snapshot copy       O(n)
    return [...this.items];
  }
  contains(item: T): boolean {   // search              O(n)
    return this.items.includes(item);
  }
}

// ── Usage ─────────────────────────────────────────────────────
const stack = new Stack<number>();
stack.push(1);
stack.push(2);
stack.push(3);
stack.peek();    // 3  (top, not removed)
stack.pop();     // 3  (removed)
stack.size();    // 2

// ── Common use-cases ──────────────────────────────────────────
// • Undo/redo systems
// • Function call stack (recursion)
// • Balanced parentheses checker
// • Browser back button history
// • DFS graph/tree traversal`,

  queue: `// ── Queue  (First In First Out — FIFO) ─────────────────────────

class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {       // add to rear         O(1)
    this.items.push(item);
  }
  dequeue(): T | undefined {     // remove from front   O(n)*
    return this.items.shift();   // *use LinkedList for O(1)
  }
  front(): T | undefined {       // peek at front       O(1)
    return this.items[0];
  }
  rear(): T | undefined {        // peek at rear        O(1)
    return this.items[this.items.length - 1];
  }
  isEmpty(): boolean {           // check if empty      O(1)
    return this.items.length === 0;
  }
  size(): number {               // number of elements  O(1)
    return this.items.length;
  }
  clear(): void {                // remove all          O(1)
    this.items = [];
  }
  toArray(): T[] {               // snapshot copy       O(n)
    return [...this.items];
  }
  contains(item: T): boolean {   // search              O(n)
    return this.items.includes(item);
  }
}

// ── O(1) dequeue via two-pointer ─────────────────────────────
class EfficientQueue<T> {
  private items: T[] = [];
  private head = 0;

  enqueue(item: T): void { this.items.push(item); }
  dequeue(): T | undefined {
    if (this.head >= this.items.length) return undefined;
    return this.items[this.head++];  // O(1) — just move pointer
  }
  size(): number { return this.items.length - this.head; }
}

// ── Common use-cases ──────────────────────────────────────────
// • Task / job schedulers
// • BFS graph/tree traversal
// • Print spoolers
// • Rate limiting / request queues
// • Sliding window algorithms`,

  linkedlist: `// ── Singly Linked List ──────────────────────────────────────────

class ListNode<T> {
  constructor(
    public val: T,
    public next: ListNode<T> | null = null
  ) {}
}

class LinkedList<T> {
  private head: ListNode<T> | null = null;
  private _size = 0;

  prepend(val: T): void {        // add to head         O(1)
    this.head = new ListNode(val, this.head);
    this._size++;
  }
  append(val: T): void {         // add to tail         O(n)
    const node = new ListNode(val);
    if (!this.head) { this.head = node; this._size++; return; }
    let cur = this.head;
    while (cur.next) cur = cur.next;
    cur.next = node; this._size++;
  }
  insertAt(index: number, val: T): void { // O(n)
    if (index === 0) { this.prepend(val); return; }
    let cur = this.head;
    for (let i = 0; i < index - 1 && cur; i++) cur = cur.next;
    if (!cur) return;
    cur.next = new ListNode(val, cur.next); this._size++;
  }
  deleteAt(index: number): void { // remove at index    O(n)
    if (!this.head) return;
    if (index === 0) { this.head = this.head.next; this._size--; return; }
    let cur = this.head;
    for (let i = 0; i < index - 1 && cur.next; i++) cur = cur.next;
    if (cur.next) { cur.next = cur.next.next; this._size--; }
  }
  deleteVal(val: T): void {      // remove first match  O(n)
    if (!this.head) return;
    if (this.head.val === val) { this.head = this.head.next; this._size--; return; }
    let cur = this.head;
    while (cur.next && cur.next.val !== val) cur = cur.next;
    if (cur.next) { cur.next = cur.next.next; this._size--; }
  }
  get(index: number): T | null { // access by index     O(n)
    let cur = this.head, i = 0;
    while (cur) { if (i === index) return cur.val; cur = cur.next; i++; }
    return null;
  }
  search(val: T): number {       // find index of val   O(n)
    let cur = this.head, i = 0;
    while (cur) { if (cur.val === val) return i; cur = cur.next; i++; }
    return -1;
  }
  reverse(): void {              // reverse in-place    O(n)
    let prev = null, cur = this.head;
    while (cur) {
      const next = cur.next;
      cur.next = prev; prev = cur; cur = next;
    }
    this.head = prev as ListNode<T> | null;
  }
  toArray(): T[] {               // convert to array    O(n)
    const result: T[] = [];
    let cur = this.head;
    while (cur) { result.push(cur.val); cur = cur.next; }
    return result;
  }
  size(): number { return this._size; }   // O(1)
  isEmpty(): boolean { return this._size === 0; }

  // ── Find middle node (Floyd's tortoise & hare) ───────────
  middle(): T | null {           //                     O(n)
    let slow = this.head, fast = this.head;
    while (fast?.next?.next) { slow = slow!.next; fast = fast.next.next; }
    return slow?.val ?? null;
  }

  // ── Detect cycle (Floyd's algorithm) ─────────────────────
  hasCycle(): boolean {          //                     O(n)
    let slow = this.head, fast = this.head;
    while (fast?.next) {
      slow = slow!.next; fast = fast.next.next;
      if (slow === fast) return true;
    }
    return false;
  }
}`,

  bst: `// ── Binary Search Tree ──────────────────────────────────────────
// Property: left < node < right  at every node

class BSTNode {
  constructor(
    public val: number,
    public left: BSTNode | null = null,
    public right: BSTNode | null = null
  ) {}
}

class BST {
  root: BSTNode | null = null;

  // ── Core operations ──────────────────────────────────────
  insert(val: number): void {    //                     O(log n) avg
    this.root = this._ins(this.root, val);
  }
  private _ins(node: BSTNode | null, val: number): BSTNode {
    if (!node) return new BSTNode(val);
    if (val < node.val) node.left  = this._ins(node.left,  val);
    else if (val > node.val) node.right = this._ins(node.right, val);
    return node; // duplicate ignored
  }

  search(val: number): boolean { //                     O(log n) avg
    let cur = this.root;
    while (cur) {
      if (val === cur.val) return true;
      cur = val < cur.val ? cur.left : cur.right;
    }
    return false;
  }

  delete(val: number): void {    //                     O(log n) avg
    this.root = this._del(this.root, val);
  }
  private _del(node: BSTNode | null, val: number): BSTNode | null {
    if (!node) return null;
    if      (val < node.val) node.left  = this._del(node.left,  val);
    else if (val > node.val) node.right = this._del(node.right, val);
    else {
      if (!node.left)  return node.right; // 0 or 1 child
      if (!node.right) return node.left;
      // 2 children: replace with in-order successor (min of right)
      let min = node.right;
      while (min.left) min = min.left;
      node.val   = min.val;
      node.right = this._del(node.right, min.val);
    }
    return node;
  }

  // ── Queries ───────────────────────────────────────────────
  min(): number | null {         // leftmost node       O(log n)
    let cur = this.root;
    while (cur?.left) cur = cur.left;
    return cur?.val ?? null;
  }
  max(): number | null {         // rightmost node      O(log n)
    let cur = this.root;
    while (cur?.right) cur = cur.right;
    return cur?.val ?? null;
  }
  height(): number {             // longest root→leaf   O(n)
    const h = (n: BSTNode | null): number =>
      n ? 1 + Math.max(h(n.left), h(n.right)) : 0;
    return h(this.root);
  }
  size(): number {               // total node count    O(n)
    const s = (n: BSTNode | null): number =>
      n ? 1 + s(n.left) + s(n.right) : 0;
    return s(this.root);
  }

  // ── Traversals ────────────────────────────────────────────
  inOrder(): number[] {          // Left→Root→Right → sorted output
    const out: number[] = [];
    const go = (n: BSTNode | null) => {
      if (!n) return;
      go(n.left); out.push(n.val); go(n.right);
    };
    go(this.root); return out;
  }
  preOrder(): number[] {         // Root→Left→Right → tree copy order
    const out: number[] = [];
    const go = (n: BSTNode | null) => {
      if (!n) return;
      out.push(n.val); go(n.left); go(n.right);
    };
    go(this.root); return out;
  }
  postOrder(): number[] {        // Left→Right→Root → delete order
    const out: number[] = [];
    const go = (n: BSTNode | null) => {
      if (!n) return;
      go(n.left); go(n.right); out.push(n.val);
    };
    go(this.root); return out;
  }
  levelOrder(): number[][] {     // BFS level by level  O(n)
    if (!this.root) return [];
    const result: number[][] = [], queue = [this.root];
    while (queue.length) {
      const level: number[] = [];
      for (let i = 0, len = queue.length; i < len; i++) {
        const node = queue.shift()!;
        level.push(node.val);
        if (node.left)  queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
      result.push(level);
    }
    return result;
  }
}`,

  hashmap: `// ── Hash Map  (separate chaining) ───────────────────────────────

class HashMap<V> {
  private buckets: Array<Array<[string, V]>>;
  private _size = 0;
  private readonly capacity: number;

  constructor(capacity = 16) {
    this.capacity = capacity;
    this.buckets  = Array.from({ length: capacity }, () => []);
  }

  // ── Hash function (djb2-style) ────────────────────────────
  private hash(key: string): number {
    return [...key].reduce(
      (h, c) => (h * 31 + c.charCodeAt(0)) % this.capacity,
      0
    );
  }

  // ── Core operations ──────────────────────────────────────
  set(key: string, val: V): void {   // insert / update  O(1) avg
    const i   = this.hash(key);
    const idx = this.buckets[i].findIndex(([k]) => k === key);
    if (idx >= 0) this.buckets[i][idx][1] = val;
    else { this.buckets[i].push([key, val]); this._size++; }
  }

  get(key: string): V | undefined {  // lookup           O(1) avg
    return this.buckets[this.hash(key)]
      .find(([k]) => k === key)?.[1];
  }

  has(key: string): boolean {        // existence check  O(1) avg
    return !!this.buckets[this.hash(key)].find(([k]) => k === key);
  }

  delete(key: string): boolean {     // remove           O(1) avg
    const i   = this.hash(key);
    const idx = this.buckets[i].findIndex(([k]) => k === key);
    if (idx < 0) return false;
    this.buckets[i].splice(idx, 1); this._size--; return true;
  }

  // ── Iteration ────────────────────────────────────────────
  keys(): string[] {                 //                  O(n)
    return this.buckets.flat().map(([k]) => k);
  }
  values(): V[] {                    //                  O(n)
    return this.buckets.flat().map(([, v]) => v);
  }
  entries(): [string, V][] {         //                  O(n)
    return this.buckets.flat();
  }
  forEach(cb: (val: V, key: string) => void): void {
    for (const [k, v] of this.entries()) cb(v, k);
  }

  // ── Utility ───────────────────────────────────────────────
  size(): number { return this._size; }
  isEmpty(): boolean { return this._size === 0; }
  clear(): void {
    this.buckets = Array.from({ length: this.capacity }, () => []);
    this._size   = 0;
  }

  // ── Load factor (resize when > 0.75) ─────────────────────
  loadFactor(): number { return this._size / this.capacity; }
}

// ── JS built-in equivalents ───────────────────────────────────
const map = new Map<string, number>();
map.set('a', 1);           // O(1)
map.get('a');              // 1        O(1)
map.has('a');              // true     O(1)
map.delete('a');           //          O(1)
map.size;                  // 0
map.keys();                // iterator
map.values();              // iterator
map.entries();             // iterator
map.forEach((v, k) => {});`,
}

// ─── Shared hook ──────────────────────────────────────────────────────────────
function useLog() {
  const [log, setLog] = useState<string>('')
  const [highlighted, setHighlighted] = useState<Set<number>>(new Set())
  const flash = (indices: number[], msg: string, duration = 1400) => {
    setHighlighted(new Set(indices))
    setLog(msg)
    setTimeout(() => setHighlighted(new Set()), duration)
  }
  return { log, flash, highlighted, setLog }
}

// ─── Panel wrapper (adds code toggle) ────────────────────────────────────────
function Panel({ tab, children }: { tab: Tab; children: React.ReactNode }) {
  const [showCode, setShowCode] = useState(false)
  return (
    <div className="ds-panel">
      {children}
      <button
        className={`btn ds-code-toggle ${showCode ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => setShowCode(v => !v)}
      >
        {showCode ? 'Hide Code' : 'Show Code &amp; Methods'}
      </button>
      {showCode && <CodeBlock code={CODE[tab]} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ARRAY
// ═══════════════════════════════════════════════════════════════════════════════
function ArrayViz() {
  const [items, setItems] = useState([10, 24, 3, 57, 8])
  const [val, setVal] = useState('')
  const [idx, setIdx] = useState('')
  const { log, flash, highlighted } = useLog()

  const push = () => {
    const v = parseInt(val); if (isNaN(v)) return
    setItems(p => { flash([p.length], `push(${v}) → appended at index ${p.length}`); return [...p, v] })
    setVal('')
  }
  const pop = () => {
    if (!items.length) return
    flash([items.length - 1], `pop() → removed ${items[items.length - 1]} from index ${items.length - 1}`)
    setTimeout(() => setItems(p => p.slice(0, -1)), 900)
  }
  const insertAt = () => {
    const v = parseInt(val), i = parseInt(idx)
    if (isNaN(v) || isNaN(i) || i < 0 || i > items.length) return
    const next = [...items]; next.splice(i, 0, v)
    setItems(next); flash([i], `insert(${v}, ${i}) → shifted items right`)
    setVal(''); setIdx('')
  }
  const deleteAt = () => {
    const i = parseInt(idx)
    if (isNaN(i) || i < 0 || i >= items.length) return
    flash([i], `delete(${i}) → removed ${items[i]}, shifted items left`)
    setTimeout(() => setItems(p => p.filter((_, j) => j !== i)), 900)
    setIdx('')
  }

  return (
    <Panel tab="array">
      <p className="ds-desc">
        Elements stored in <strong>contiguous memory</strong>. Index lookup is instant (O(1)) because the address
        is computed as <code>base + index × size</code>. Insertions/deletions in the middle are O(n) because
        every element after the target must shift.
      </p>
      <div className="ds-visual array-visual">
        {items.length === 0 && <span className="ds-empty">Empty array</span>}
        {items.map((v, i) => (
          <div key={i} className={`ds-cell ${highlighted.has(i) ? 'ds-flash' : ''}`}>
            <span className="ds-val">{v}</span>
            <span className="ds-lbl">[{i}]</span>
          </div>
        ))}
      </div>
      {log && <div className="ds-log">{log}</div>}
      <div className="ds-controls">
        <input className="ds-input" type="number" placeholder="Value" value={val} onChange={e => setVal(e.target.value)} />
        <input className="ds-input ds-input-sm" type="number" placeholder="Index" value={idx} onChange={e => setIdx(e.target.value)} />
        <button className="btn btn-primary" onClick={push}>Push</button>
        <button className="btn btn-secondary" onClick={pop}>Pop</button>
        <button className="btn btn-secondary" onClick={insertAt}>Insert at</button>
        <button className="btn btn-secondary" onClick={deleteAt}>Delete at</button>
      </div>
    </Panel>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STACK
// ═══════════════════════════════════════════════════════════════════════════════
function StackViz() {
  const [items, setItems] = useState([5, 12, 8])
  const [val, setVal] = useState('')
  const { log, flash, highlighted } = useLog()

  const push = () => {
    const v = parseInt(val); if (isNaN(v)) return
    setItems(p => [v, ...p]); flash([0], `push(${v}) → new TOP`)
    setVal('')
  }
  const pop = () => {
    if (!items.length) return
    flash([0], `pop() → ${items[0]} removed from TOP`)
    setTimeout(() => setItems(p => p.slice(1)), 900)
  }
  const peek = () => {
    if (!items.length) return
    flash([0], `peek() → TOP is ${items[0]}`)
  }

  return (
    <Panel tab="stack">
      <p className="ds-desc">
        <strong>Last In, First Out (LIFO)</strong>. Only the TOP element is accessible. Think of a pile of plates —
        you can only add/remove from the top. Used in: function call stacks, undo systems, expression parsing.
      </p>
      <div className="ds-visual stack-visual">
        {items.length === 0 && <span className="ds-empty">Empty stack</span>}
        {items.map((v, i) => (
          <div key={i} className={`ds-cell stack-cell ${highlighted.has(i) ? 'ds-flash' : ''}`}>
            <span className="ds-val">{v}</span>
            {i === 0 && <span className="ds-tag">TOP</span>}
          </div>
        ))}
        {items.length > 0 && <div className="stack-base">▓ BASE ▓</div>}
      </div>
      {log && <div className="ds-log">{log}</div>}
      <div className="ds-controls">
        <input className="ds-input" type="number" placeholder="Value" value={val} onChange={e => setVal(e.target.value)} />
        <button className="btn btn-primary" onClick={push}>Push</button>
        <button className="btn btn-secondary" onClick={pop}>Pop</button>
        <button className="btn btn-secondary" onClick={peek}>Peek</button>
      </div>
    </Panel>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUEUE
// ═══════════════════════════════════════════════════════════════════════════════
function QueueViz() {
  const [items, setItems] = useState([4, 9, 2, 7])
  const [val, setVal] = useState('')
  const { log, flash, highlighted } = useLog()

  const enqueue = () => {
    const v = parseInt(val); if (isNaN(v)) return
    setItems(p => [...p, v]); flash([items.length], `enqueue(${v}) → added at REAR`)
    setVal('')
  }
  const dequeue = () => {
    if (!items.length) return
    flash([0], `dequeue() → ${items[0]} removed from FRONT`)
    setTimeout(() => setItems(p => p.slice(1)), 900)
  }

  return (
    <Panel tab="queue">
      <p className="ds-desc">
        <strong>First In, First Out (FIFO)</strong>. New items enter at the REAR, items leave from the FRONT —
        like a real queue/line. Used in: task schedulers, BFS graph traversal, print spoolers.
      </p>
      <div className="ds-visual queue-visual">
        <span className="queue-label">FRONT</span>
        {items.length === 0 && <span className="ds-empty">Empty queue</span>}
        {items.map((v, i) => (
          <div key={i} className={`ds-cell ${highlighted.has(i) ? 'ds-flash' : ''} ${i === 0 ? 'queue-front' : ''} ${i === items.length - 1 ? 'queue-rear' : ''}`}>
            <span className="ds-val">{v}</span>
            {i === 0 && <span className="ds-lbl">front</span>}
            {i === items.length - 1 && i !== 0 && <span className="ds-lbl">rear</span>}
          </div>
        ))}
        <span className="queue-label">REAR</span>
      </div>
      {log && <div className="ds-log">{log}</div>}
      <div className="ds-controls">
        <input className="ds-input" type="number" placeholder="Value" value={val} onChange={e => setVal(e.target.value)} />
        <button className="btn btn-primary" onClick={enqueue}>Enqueue</button>
        <button className="btn btn-secondary" onClick={dequeue}>Dequeue</button>
      </div>
    </Panel>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LINKED LIST
// ═══════════════════════════════════════════════════════════════════════════════
let _llid = 0
interface LLNode { id: number; val: number }

function LinkedListViz() {
  const [nodes, setNodes] = useState<LLNode[]>([
    { id: ++_llid, val: 3 }, { id: ++_llid, val: 7 }, { id: ++_llid, val: 1 }, { id: ++_llid, val: 9 },
  ])
  const [val, setVal] = useState('')
  const [idx, setIdx] = useState('')
  const { log, flash, highlighted } = useLog()

  const append = () => {
    const v = parseInt(val); if (isNaN(v)) return
    setNodes(p => [...p, { id: ++_llid, val: v }])
    flash([nodes.length], `append(${v}) → new tail node`)
    setVal('')
  }
  const prepend = () => {
    const v = parseInt(val); if (isNaN(v)) return
    setNodes(p => [{ id: ++_llid, val: v }, ...p])
    flash([0], `prepend(${v}) → new head node`)
    setVal('')
  }
  const deleteAt = () => {
    const i = parseInt(idx)
    if (isNaN(i) || i < 0 || i >= nodes.length) return
    flash([i], `deleteAt(${i}) → unlink node ${nodes[i].val}, redirect prev→next`)
    setTimeout(() => setNodes(p => p.filter((_, j) => j !== i)), 900)
    setIdx('')
  }

  return (
    <Panel tab="linkedlist">
      <p className="ds-desc">
        Nodes scattered in memory, each holding a <strong>value + pointer to next</strong>.
        No index math — traversal is O(n). But insert/delete at a known position is O(1)
        (just redirect pointers). No reallocation needed.
      </p>
      <div className="ds-visual ll-visual">
        {nodes.length === 0 && <span className="ds-empty">Empty list</span>}
        {nodes.map((n, i) => (
          <div key={n.id} className="ll-node-wrap">
            <div className={`ds-cell ll-cell ${highlighted.has(i) ? 'ds-flash' : ''}`}>
              <span className="ds-val">{n.val}</span>
              <span className="ds-lbl">{i === 0 ? 'head' : i === nodes.length - 1 ? 'tail' : `[${i}]`}</span>
              <div className="ll-ptr">*next</div>
            </div>
            {i < nodes.length - 1 && <span className="ll-arrow">→</span>}
          </div>
        ))}
        {nodes.length > 0 && <span className="ll-null">NULL</span>}
      </div>
      {log && <div className="ds-log">{log}</div>}
      <div className="ds-controls">
        <input className="ds-input" type="number" placeholder="Value" value={val} onChange={e => setVal(e.target.value)} />
        <input className="ds-input ds-input-sm" type="number" placeholder="Index" value={idx} onChange={e => setIdx(e.target.value)} />
        <button className="btn btn-primary" onClick={prepend}>Prepend</button>
        <button className="btn btn-secondary" onClick={append}>Append</button>
        <button className="btn btn-secondary" onClick={deleteAt}>Delete at</button>
      </div>
    </Panel>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// BST
// ═══════════════════════════════════════════════════════════════════════════════
interface BSTNode { val: number; left: BSTNode | null; right: BSTNode | null }
interface BSTLayout { val: number; x: number; y: number }
interface BSTEdge { x1: number; y1: number; x2: number; y2: number }

function bstInsert(root: BSTNode | null, val: number): BSTNode {
  if (!root) return { val, left: null, right: null }
  if (val < root.val) return { ...root, left: bstInsert(root.left, val) }
  if (val > root.val) return { ...root, right: bstInsert(root.right, val) }
  return root
}
function bstDelete(root: BSTNode | null, val: number): BSTNode | null {
  if (!root) return null
  if (val < root.val) return { ...root, left: bstDelete(root.left, val) }
  if (val > root.val) return { ...root, right: bstDelete(root.right, val) }
  if (!root.left) return root.right
  if (!root.right) return root.left
  let min = root.right; while (min.left) min = min.left
  return { val: min.val, left: root.left, right: bstDelete(root.right, min.val) }
}
function bstSearch(root: BSTNode | null, val: number): number[] {
  const path: number[] = []
  let cur = root
  while (cur) {
    path.push(cur.val)
    if (val === cur.val) break
    cur = val < cur.val ? cur.left : cur.right
  }
  return path
}
function buildLayout(node: BSTNode | null, depth: number, left: number, right: number, nodes: BSTLayout[], edges: BSTEdge[], px?: number, py?: number) {
  if (!node) return
  const x = (left + right) / 2, y = depth * 72 + 36
  nodes.push({ val: node.val, x, y })
  if (px !== undefined && py !== undefined) edges.push({ x1: px, y1: py, x2: x, y2: y })
  buildLayout(node.left,  depth + 1, left, x, nodes, edges, x, y)
  buildLayout(node.right, depth + 1, x, right, nodes, edges, x, y)
}

function BSTViz() {
  const [root, setRoot] = useState<BSTNode | null>(() => {
    let r: BSTNode | null = null
    for (const v of [20, 10, 30, 5, 15, 25, 35]) r = bstInsert(r, v)
    return r
  })
  const [val, setVal] = useState('')
  const [searchPath, setSearchPath] = useState<Set<number>>(new Set())
  const { log, setLog } = useLog()

  const nodes: BSTLayout[] = [], edges: BSTEdge[] = []
  buildLayout(root, 0, 0, 560, nodes, edges)
  const svgH = nodes.length ? Math.max(...nodes.map(n => n.y)) + 48 : 80

  const insert = () => {
    const v = parseInt(val); if (isNaN(v)) return
    setRoot(bstInsert(root, v))
    setLog(`insert(${v}) → placed by BST property: left < root < right`)
    setSearchPath(new Set()); setVal('')
  }
  const del = () => {
    const v = parseInt(val); if (isNaN(v)) return
    setRoot(bstDelete(root, v))
    setLog(`delete(${v}) → if 2 children, replaced with in-order successor`)
    setSearchPath(new Set()); setVal('')
  }
  const search = () => {
    const v = parseInt(val); if (isNaN(v)) return
    const path = bstSearch(root, v)
    setSearchPath(new Set(path))
    const found = path[path.length - 1] === v
    setLog(found ? `search(${v}) → found after ${path.length} comparisons: ${path.join(' → ')}` : `search(${v}) → not found. Path: ${path.join(' → ')}`)
    setTimeout(() => setSearchPath(new Set()), 2500)
    setVal('')
  }

  return (
    <Panel tab="bst">
      <p className="ds-desc">
        Each node satisfies: <strong>left subtree &lt; node &lt; right subtree</strong>.
        This property means search eliminates half the tree at each step — O(log n) average.
        Worst case O(n) for a skewed tree (sorted insertions).
      </p>
      <div className="ds-visual bst-visual">
        <svg width="100%" height={svgH} viewBox={`0 0 560 ${svgH}`} className="bst-svg">
          {edges.map((e, i) => (
            <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="rgba(148,163,184,0.35)" strokeWidth={1.5} />
          ))}
          {nodes.map(n => (
            <g key={n.val}>
              <circle cx={n.x} cy={n.y} r={22} className={`bst-node ${searchPath.has(n.val) ? 'bst-node-flash' : ''}`} />
              <text x={n.x} y={n.y + 5} textAnchor="middle" className="bst-text">{n.val}</text>
            </g>
          ))}
          {nodes.length === 0 && <text x={280} y={40} textAnchor="middle" fill="var(--text-secondary)">Empty tree</text>}
        </svg>
      </div>
      {log && <div className="ds-log">{log}</div>}
      <div className="ds-controls">
        <input className="ds-input" type="number" placeholder="Value" value={val} onChange={e => setVal(e.target.value)} />
        <button className="btn btn-primary" onClick={insert}>Insert</button>
        <button className="btn btn-secondary" onClick={search}>Search</button>
        <button className="btn btn-secondary" onClick={del}>Delete</button>
      </div>
    </Panel>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// HASH MAP
// ═══════════════════════════════════════════════════════════════════════════════
const NUM_BUCKETS = 7
function hashFn(key: string) {
  return [...key].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % NUM_BUCKETS, 0)
}
interface HashEntry { key: string; value: string }

function HashMapViz() {
  const [buckets, setBuckets] = useState<HashEntry[][]>(Array.from({ length: NUM_BUCKETS }, () => []))
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')
  const [flashBucket, setFlashBucket] = useState<number | null>(null)
  const { log, setLog } = useLog()

  const flash = (idx: number, msg: string) => {
    setFlashBucket(idx); setLog(msg)
    setTimeout(() => setFlashBucket(null), 1400)
  }
  const set = () => {
    if (!key) return
    const h = hashFn(key)
    setBuckets(prev => {
      const next = prev.map(b => [...b])
      const i = next[h].findIndex(e => e.key === key)
      if (i >= 0) next[h][i] = { key, value }
      else next[h].push({ key, value })
      return next
    })
    flash(h, `set("${key}") → hash = bucket[${h}]`)
    setKey(''); setValue('')
  }
  const get = () => {
    if (!key) return
    const h = hashFn(key)
    const entry = buckets[h].find(e => e.key === key)
    flash(h, entry ? `get("${key}") → found in bucket[${h}]: "${entry.value}"` : `get("${key}") → not found in bucket[${h}]`)
    setKey('')
  }
  const del = () => {
    if (!key) return
    const h = hashFn(key)
    setBuckets(prev => {
      const next = prev.map(b => [...b])
      next[h] = next[h].filter(e => e.key !== key)
      return next
    })
    flash(h, `delete("${key}") → removed from bucket[${h}]`)
    setKey('')
  }

  return (
    <Panel tab="hashmap">
      <p className="ds-desc">
        A <strong>hash function</strong> converts a key into a bucket index — O(1) set/get.
        <strong> Collisions</strong> (multiple keys → same bucket) are resolved via chaining.
        Load factor &gt; 0.75 triggers a resize.
      </p>
      <div className="ds-visual hashmap-visual">
        {buckets.map((bucket, i) => (
          <div key={i} className={`hm-bucket ${flashBucket === i ? 'ds-flash' : ''}`}>
            <div className="hm-index">[{i}]</div>
            <div className="hm-chain">
              {bucket.length === 0
                ? <span className="hm-null">∅</span>
                : bucket.map((e, j) => (
                    <div key={j} className="hm-entry">
                      <span className="hm-key">{e.key}</span>
                      <span className="hm-sep">:</span>
                      <span className="hm-val">{e.value || '—'}</span>
                    </div>
                  ))}
            </div>
          </div>
        ))}
      </div>
      {log && <div className="ds-log">{log}</div>}
      <div className="ds-controls">
        <input className="ds-input" type="text" placeholder="Key" value={key} onChange={e => setKey(e.target.value)} />
        <input className="ds-input" type="text" placeholder="Value" value={value} onChange={e => setValue(e.target.value)} />
        <button className="btn btn-primary" onClick={set}>Set</button>
        <button className="btn btn-secondary" onClick={get}>Get</button>
        <button className="btn btn-secondary" onClick={del}>Delete</button>
      </div>
    </Panel>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
const PANELS: Record<Tab, () => React.JSX.Element> = {
  array:      ArrayViz,
  stack:      StackViz,
  queue:      QueueViz,
  linkedlist: LinkedListViz,
  bst:        BSTViz,
  hashmap:    HashMapViz,
}

export function DSVisualizer() {
  const [active, setActive] = useState<Tab>('array')
  const Panel = PANELS[active]
  const meta = TABS.find(t => t.id === active)!

  return (
    <div className="dsv-container">
      <div className="dsv-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`dsv-tab ${active === t.id ? 'dsv-tab-active' : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="dsv-complexity">{meta.complexity}</div>
      <Panel />
    </div>
  )
}
