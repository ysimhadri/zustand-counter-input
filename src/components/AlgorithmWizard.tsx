/**
 * Implementation of the algorithm decision flowchart for coding interviews.
 */
import { useState } from 'react';
import './AlgorithmWizard.css';

type StepId =
  | 'start'
  | 'array_string_sorted'
  | 'array_question_type'
  | 'array_decisions'
  | 'array_greedy'
  | 'array_continuously'
  | 'graph_shortest'
  | 'tree_depth'
  | 'linked_list_type';

interface Option {
  label: string;
  next?: StepId;
  result?: string;
}

interface Step {
  question: string;
  options: Option[];
}

const FLOWCHART: Record<StepId, Step> = {
  start: {
    question: "What is the primary input data structure?",
    options: [
      { label: "Array or String", next: "array_string_sorted" },
      { label: "Graph", next: "graph_shortest" },
      { label: "Tree (probably binary)", next: "tree_depth" },
      { label: "Linked List", next: "linked_list_type" },
      { label: "Other / Not Sure", result: "Think about for any problem: Hash map or set" }
    ]
  },
  array_string_sorted: {
    question: "Is the input array sorted?",
    options: [
      { label: "Yes", result: "Binary search OR Two pointers" },
      { label: "No", next: "array_question_type" }
    ]
  },
  array_question_type: {
    question: "What is the question asking for?",
    options: [
      { label: "ALL of something", result: "Backtracking" },
      { label: "Max/min possible of something OR Is something possible? OR Number of ways to do something", next: "array_decisions" },
      { label: "String building OR Distance between elements", result: "Stack or monotonic stack" },
      { label: "Finding a specific element", result: "Hash map or set" },
      { label: "Problem involves subarrays or substrings", result: "Sliding window or counting hash map" },
      { label: "Prefix matching", result: "Trie" },
      { label: "Continuously finding max/min element", next: "array_continuously" }
    ]
  },
  array_decisions: {
    question: "Do 'decisions' need to be made, which are affected by other decisions?",
    options: [
      { label: "Yes", result: "Dynamic programming" },
      { label: "No", next: "array_greedy" }
    ]
  },
  array_greedy: {
    question: "Does the problem satisfy a property where 'possible' and 'impossible' are two infinite zones separated by a threshold?",
    options: [
      { label: "No (Not necessarily greedy...)", result: "Greedy" },
      { label: "Yes", result: "Binary Search (on the answer)" }
    ]
  },
  array_continuously: {
    question: "How are elements added/removed?",
    options: [
      { label: "Sliding window fashion", result: "Monotonic queue" },
      { label: "Max/min continuously removed", result: "Heap (Priority Queue)" }
    ]
  },
  graph_shortest: {
    question: "Does the question want the shortest path or fewest steps?",
    options: [
      { label: "Yes", result: "BFS (Breadth-First Search)" },
      { label: "No", result: "DFS (Depth-First Search)" }
    ]
  },
  tree_depth: {
    question: "Does the question involve looking at specific depths or levels?",
    options: [
      { label: "Yes", result: "BFS (Breadth-First Search)" },
      { label: "No", result: "DFS (Depth-First Search)" }
    ]
  },
  linked_list_type: {
    question: "What does the question involve?",
    options: [
      { label: "Finding a node at specific location OR Detecting cycles", result: "Fast and slow pointer" },
      { label: "Reversing", result: "“prev” pointer" },
      { label: "Return original head", result: "“dummy” pointer" }
    ]
  }
};

export function AlgorithmWizard() {
  const [history, setHistory] = useState<StepId[]>(['start']);
  const [result, setResult] = useState<string | null>(null);

  const currentStepId = history[history.length - 1];
  const stepConfig = FLOWCHART[currentStepId];

  const handleOptionClick = (option: Option) => {
    if (option.result) {
      setResult(option.result);
    } else if (option.next) {
      setHistory([...history, option.next]);
    }
  };

  const handleBack = () => {
    if (result) {
      setResult(null);
    } else if (history.length > 1) {
      setHistory(history.slice(0, -1));
    }
  };

  const handleReset = () => {
    setHistory(['start']);
    setResult(null);
  };

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h2 className="wizard-title">Algorithm Selection Guide</h2>
        <p className="wizard-subtitle">Discover the right data structure & algorithm for your technical interview question</p>
      </div>

      {(history.length > 1 || result) && (
        <button className="wizard-back-btn" onClick={handleBack}>
          ← Back
        </button>
      )}

      {result ? (
        <div className="wizard-result-box">
          <div className="wizard-result-label">Recommended Approach</div>
          <div className="wizard-result-value">{result}</div>
          <button className="wizard-reset-btn" onClick={handleReset}>
            ↺ Start Over
          </button>
        </div>
      ) : (
        <div className="wizard-step-container" key={currentStepId}>
          <div className="wizard-question">{stepConfig.question}</div>
          <div className="wizard-options">
            {stepConfig.options.map((option, index) => (
              <button
                key={index}
                className="wizard-btn"
                onClick={() => handleOptionClick(option)}
              >
                <span>{option.label}</span>
                <span style={{ opacity: 0.5 }}>→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
