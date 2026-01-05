"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash, RefreshCw, Search, Info, Palette } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text, Box, Sphere, Line } from "@react-three/drei"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface Node {
  id: string
  value: number
  left?: string
  right?: string
}

interface GraphNode {
  id: string
  value: number
  edges: string[]
  position?: [number, number, number]
}

interface LinkedListNode {
  id: string
  value: number
  next?: string
}

interface StackNode {
  id: string
  value: number
}

interface QueueNode {
  id: string
  value: number
}

interface HeapNode {
  id: string
  value: number
  position?: [number, number, number]
}

interface HashTableEntry {
  key: string
  value: number
  index: number
}

export type DataStructure = "array" | "tree" | "linkedList" | "graph" | "stack" | "queue" | "heap" | "hashTable"

interface DataStructureVisualizerProps {
  dataStructure: DataStructure
  is3D?: boolean
  colorMode?: "default" | "rainbow" | "heat" | "pastel"
  height?: number
}

interface DataStructureInfo {
  definition: string
  why: string
  when: string
  advantages: string[]
  disadvantages: string[]
  timeComplexity: {
    access: string
    search: string
    insert: string
    delete: string
  }
  spaceComplexity: string
  exampleProblems: string[]
  realWorldApplications: string[]
}

const dataStructureInfo: Record<DataStructure, DataStructureInfo> = {
  array: {
    definition: "An array is a linear data structure that stores elements of the same type in contiguous memory locations, accessible via indices. Each element is identified by its index, starting from 0.",
    why: "Arrays provide fast access to elements using indices and are memory-efficient due to their contiguous storage. They are simple to implement and ideal for scenarios requiring quick lookups.",
    when: "Use arrays for fixed-size collections, random access, or when memory efficiency is critical, such as in image processing, simple lists, or lookup tables.",
    advantages: [
      "Constant-time O(1) access to elements via index",
      "Memory efficient due to contiguous storage",
      "Simple to implement and understand",
      "Supports iteration and sorting efficiently"
    ],
    disadvantages: [
      "Fixed size (in most languages), requiring resizing",
      "Insertions and deletions are O(n) due to shifting",
      "Not suitable for dynamic data"
    ],
    timeComplexity: {
      access: "O(1)",
      search: "O(n) (linear search), O(log n) (binary search if sorted)",
      insert: "O(n) (at beginning/end), O(1) (at end with space)",
      delete: "O(n) (at beginning/end), O(1) (at end)",
    },
    spaceComplexity: "O(n)",
    exampleProblems: ["Two Sum", "Maximum Subarray", "Rotate Array", "Merge Intervals"],
    realWorldApplications: [
      "Storing pixel values in image processing",
      "Implementing lookup tables",
      "Managing simple lists like student scores",
      "Caching frequently accessed data"
    ]
  },
  tree: {
    definition: "A tree is a hierarchical data structure with nodes connected by edges, where each node has at most two children in a binary tree. It consists of a root node and subtrees, often used to represent hierarchical relationships.",
    why: "Trees efficiently represent hierarchical relationships and enable logarithmic-time operations for searching, insertion, and deletion in balanced cases. Binary Search Trees (BSTs) maintain sorted order for efficient lookups.",
    when: "Use trees for hierarchical data (e.g., file systems), searching (e.g., BSTs), decision-making algorithms, or when implementing structures like heaps or tries.",
    advantages: [
      "Efficient logarithmic operations in balanced trees",
      "Represents hierarchical relationships naturally",
      "Flexible for various applications (e.g., BST, AVL, Red-Black)",
      "Supports recursive algorithms"
    ],
    disadvantages: [
      "Unbalanced trees can degrade to O(n) performance",
      "Complex to implement and maintain balance",
      "Higher memory overhead due to pointers"
    ],
    timeComplexity: {
      access: "O(log n) (balanced), O(n) (unbalanced)",
      search: "O(log n) (balanced), O(n) (unbalanced)",
      insert: "O(log n) (balanced), O(n) (unbalanced)",
      delete: "O(log n) (balanced), O(n) (unbalanced)",
    },
    spaceComplexity: "O(n)",
    exampleProblems: ["Binary Tree Inorder Traversal", "Lowest Common Ancestor", "Validate Binary Search Tree", "Path Sum"],
    realWorldApplications: [
      "File system structures",
      "Database indexing (B-trees)",
      "Decision trees in machine learning",
      "XML/HTML DOM parsing"
    ]
  },
  linkedList: {
    definition: "A linked list is a linear data structure where elements (nodes) are stored in non-contiguous memory, each containing a value and a pointer to the next node. Variants include singly, doubly, and circular linked lists.",
    why: "Linked lists allow efficient insertion and deletion at the beginning or end and dynamic memory allocation, making them ideal for scenarios where size changes frequently.",
    when: "Use linked lists for dynamic data, frequent insertions/deletions, or when implementing stacks, queues, or adjacency lists for graphs.",
    advantages: [
      "Dynamic size with efficient O(1) insertions/deletions at head",
      "No need for contiguous memory",
      "Flexible for implementing other data structures"
    ],
    disadvantages: [
      "O(n) access and search due to sequential traversal",
      "Extra memory for pointers",
      "Not cache-friendly due to non-contiguous storage"
    ],
    timeComplexity: {
      access: "O(n)",
      search: "O(n)",
      insert: "O(1) (at head/tail), O(n) (at position)",
      delete: "O(1) (at head), O(n) (at position/tail)",
    },
    spaceComplexity: "O(n)",
    exampleProblems: ["Reverse Linked List", "Merge Two Sorted Lists", "Cycle Detection", "Add Two Numbers"],
    realWorldApplications: [
      "Implementing undo functionality in editors",
      "Task scheduling in operating systems",
      "Adjacency lists in graph algorithms",
      "Music playlist management"
    ]
  },
  graph: {
    definition: "A graph is a non-linear data structure consisting of nodes (vertices) connected by edges, representing relationships. It can be directed or undirected, weighted or unweighted, and represented using adjacency lists or matrices.",
    why: "Graphs model complex relationships, such as networks, social connections, or paths, and support algorithms like shortest path, traversal, or cycle detection.",
    when: "Use graphs for network analysis, pathfinding, social networks, dependency modeling, or recommendation systems.",
    advantages: [
      "Flexible for modeling complex relationships",
      "Supports diverse algorithms (DFS, BFS, Dijkstra’s)",
      "Adaptable to directed/undirected and weighted variants"
    ],
    disadvantages: [
      "High memory usage for dense graphs (O(V²) in matrices)",
      "Complex to implement and traverse",
      "Edge operations can be costly in adjacency lists"
    ],
    timeComplexity: {
      access: "O(1) (adjacency list/matrix)",
      search: "O(V + E) (DFS/BFS)",
      insert: "O(1) (edge in adjacency list), O(1) (matrix)",
      delete: "O(E) (edge in adjacency list), O(1) (matrix)",
    },
    spaceComplexity: "O(V + E) (adjacency list), O(V²) (matrix)",
    exampleProblems: ["Shortest Path (Dijkstra’s)", "Minimum Spanning Tree", "Topological Sort", "Course Schedule"],
    realWorldApplications: [
      "Social network analysis",
      "GPS navigation and route planning",
      "Dependency management in build systems",
      "Recommendation systems"
    ]
  },
  stack: {
    definition: "A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle, with operations push (add) and pop (remove) performed at the top.",
    why: "Stacks are ideal for tracking state, backtracking, or managing function calls due to their LIFO nature, making them essential for recursive algorithms and expression evaluation.",
    when: "Use stacks for expression evaluation, undo mechanisms, backtracking algorithms, or managing function call stacks.",
    advantages: [
      "O(1) push and pop operations",
      "Simple to implement",
      "Ideal for LIFO-based problems"
    ],
    disadvantages: [
      "O(n) access and search",
      "Limited to LIFO access pattern",
      "Not suitable for random access"
    ],
    timeComplexity: {
      access: "O(n)",
      search: "O(n)",
      insert: "O(1) (push)",
      delete: "O(1) (pop)",
    },
    spaceComplexity: "O(n)",
    exampleProblems: ["Valid Parentheses", "Min Stack", "Evaluate Reverse Polish Notation", "Daily Temperatures"],
    realWorldApplications: [
      "Function call stack in programming",
      "Undo functionality in software",
      "Expression evaluation in compilers",
      "Browser history navigation"
    ]
  },
  queue: {
    definition: "A queue is a linear data structure that follows the First-In-First-Out (FIFO) principle, with operations enqueue (add at back) and dequeue (remove from front). Variants include circular and priority queues.",
    why: "Queues manage ordered processing, such as task scheduling or breadth-first search, due to their FIFO nature, ensuring fair processing of elements.",
    when: "Use queues for task scheduling, BFS, buffering data streams, or managing asynchronous tasks.",
    advantages: [
      "O(1) enqueue and dequeue operations",
      "Supports FIFO processing",
      "Flexible for variants like priority queues"
    ],
    disadvantages: [
      "O(n) access and search",
      "Limited to FIFO access pattern",
      "Not suitable for random access"
    ],
    timeComplexity: {
      access: "O(n)",
      search: "O(n)",
      insert: "O(1) (enqueue)",
      delete: "O(1) (dequeue)",
    },
    spaceComplexity: "O(n)",
    exampleProblems: ["Sliding Window Maximum", "Implement Queue using Stacks", "Level Order Traversal", "Task Scheduler"],
    realWorldApplications: [
      "Task scheduling in operating systems",
      "Print job management",
      "Breadth-first search in graphs",
      "Buffering in data streaming"
    ]
  },
  heap: {
    definition: "A heap is a tree-based data structure (usually a binary tree) that satisfies the heap property, where the parent node is greater (max-heap) or smaller (min-heap) than its children. It is commonly used for priority queues.",
    why: "Heaps provide efficient access to the minimum/maximum element and are used in priority-based scheduling, sorting, or graph algorithms like Dijkstra’s.",
    when: "Use heaps for priority queues, scheduling tasks, or algorithms requiring frequent min/max access, such as heap sort or shortest path.",
    advantages: [
      "O(1) access to min/max element",
      "O(log n) insert and delete operations",
      "Efficient for priority-based processing"
    ],
    disadvantages: [
      "O(n) search for arbitrary elements",
      "Not suitable for random access",
      "Complex to implement compared to arrays"
    ],
    timeComplexity: {
      access: "O(1) (root)",
      search: "O(n)",
      insert: "O(log n)",
      delete: "O(log n)",
    },
    spaceComplexity: "O(n)",
    exampleProblems: ["Kth Largest Element", "Merge K Sorted Lists", "Heap Sort", "Top K Frequent Elements"],
    realWorldApplications: [
      "Task scheduling with priorities",
      "Event simulation systems",
      "Dijkstra’s shortest path algorithm",
      "Real-time analytics for top-k queries"
    ]
  },
  hashTable: {
    definition: "A hash table is a data structure that maps keys to values using a hash function for fast retrieval. It handles collisions using techniques like chaining or open addressing.",
    why: "Hash tables offer average-case constant-time operations for lookup, insertion, and deletion, making them ideal for scenarios requiring fast data retrieval.",
    when: "Use hash tables for fast data retrieval, caching, frequency counting, or implementing associative arrays and sets.",
    advantages: [
      "O(1) average-case operations",
      "Efficient for key-value mappings",
      "Flexible for various data types as keys"
    ],
    disadvantages: [
      "O(n) worst-case operations due to collisions",
      "Requires good hash function design",
      "Higher memory usage due to load factor"
    ],
    timeComplexity: {
      access: "O(1) average, O(n) worst",
      search: "O(1) average, O(n) worst",
      insert: "O(1) average, O(n) worst",
      delete: "O(1) average, O(n) worst",
    },
    spaceComplexity: "O(n)",
    exampleProblems: ["Two Sum", "Group Anagrams", "LRU Cache", "Contains Duplicate"],
    realWorldApplications: [
      "Database indexing and caching",
      "Symbol tables in compilers",
      "Session management in web applications",
      "Deduplication in data processing"
    ]
  }
}

export default function DataStructureVisualizer({
  dataStructure,
  is3D = false,
  colorMode = "default",
  height = 400,
}: DataStructureVisualizerProps) {
  const [arrayData, setArrayData] = useState<number[]>([10, 20, 30, 40, 50])
  const [treeData, setTreeData] = useState<Node[]>([
    { id: "1", value: 50 },
    { id: "2", value: 30, left: "4", right: "5" },
    { id: "3", value: 70, left: "6", right: "7" },
    { id: "4", value: 20 },
    { id: "5", value: 40 },
    { id: "6", value: 60 },
    { id: "7", value: 80 },
  ])
  const [linkedListData, setLinkedListData] = useState<LinkedListNode[]>([
    { id: "1", value: 10, next: "2" },
    { id: "2", value: 20, next: "3" },
    { id: "3", value: 30, next: "4" },
    { id: "4", value: 40, next: "5" },
    { id: "5", value: 50 },
  ])
  const [graphData, setGraphData] = useState<GraphNode[]>([
    { id: "1", value: 1, edges: ["2", "3"], position: [0, 0, 0] },
    { id: "2", value: 2, edges: ["1", "4", "5"], position: [2, 1, 0] },
    { id: "3", value: 3, edges: ["1", "5"], position: [-2, 1, 0] },
    { id: "4", value: 4, edges: ["2"], position: [3, -1, 0] },
    { id: "5", value: 5, edges: ["2", "3"], position: [-1, -2, 0] },
  ])
  const [stackData, setStackData] = useState<StackNode[]>([
    { id: "1", value: 10 },
    { id: "2", value: 20 },
    { id: "3", value: 30 },
    { id: "4", value: 40 },
  ])
  const [queueData, setQueueData] = useState<QueueNode[]>([
    { id: "1", value: 10 },
    { id: "2", value: 20 },
    { id: "3", value: 30 },
    { id: "4", value: 40 },
  ])
  const [heapData, setHeapData] = useState<HeapNode[]>([
    { id: "1", value: 100, position: [0, 3, 0] },
    { id: "2", value: 80, position: [-2, 1.5, 0] },
    { id: "3", value: 70, position: [2, 1.5, 0] },
    { id: "4", value: 50, position: [-3, 0, 0] },
    { id: "5", value: 60, position: [-1, 0, 0] },
    { id: "6", value: 30, position: [1, 0, 0] },
    { id: "7", value: 40, position: [3, 0, 0] },
  ])
  const [hashTableData, setHashTableData] = useState<HashTableEntry[]>([
    { key: "apple", value: 10, index: 0 },
    { key: "banana", value: 20, index: 1 },
    { key: "orange", value: 30, index: 2 },
    { key: "grape", value: 40, index: 4 },
    { key: "kiwi", value: 50, index: 7 },
  ])

  const [newValue, setNewValue] = useState("")
  const [newKey, setNewKey] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [searchResult, setSearchResult] = useState<{ found: boolean; index?: number; id?: string }>({ found: false })
  const [activeOperation, setActiveOperation] = useState<"insert" | "delete" | "search" | null>(null)
  const [animationStep, setAnimationStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [currentColorMode, setCurrentColorMode] = useState(colorMode)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  // Handle window resize for responsive canvas and SVG
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasContainerRef.current) {
        const { width, height } = canvasContainerRef.current.getBoundingClientRect()
        setCanvasSize({ width, height })
      }
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)
    return () => window.removeEventListener("resize", updateCanvasSize)
  }, [])

  // Color logic based on colorMode
  const getNodeColor = (isHighlighted: boolean, index?: number, totalLength?: number) => {
    if (isHighlighted) return "#22c55e" // Vibrant green for highlights
    if (currentColorMode === "rainbow" && index !== undefined && totalLength !== undefined) {
      const hue = (index * 360 / totalLength) % 360
      return `hsl(${hue}, 80%, 60%)`
    }
    if (currentColorMode === "heat" && index !== undefined && totalLength !== undefined) {
      const intensity = index / totalLength
      return `hsl(20, 100%, ${50 + intensity * 30}%)`
    }
    if (currentColorMode === "pastel" && index !== undefined && totalLength !== undefined) {
      const hue = (index * 360 / totalLength) % 360
      return `hsl(${hue}, 50%, 80%)`
    }
    return {
      array: "linear-gradient(135deg, #f97316, #fb923c)", // Orange gradient
      tree: "linear-gradient(135deg, #22c55e, #4ade80)", // Green gradient
      linkedList: "linear-gradient(135deg, #22c55e, #4ade80)", // Green gradient
      graph: "linear-gradient(135deg, #0ea5e9, #38bdf8)", // Blue gradient
      stack: "linear-gradient(135deg, #3b82f6, #60a5fa)", // Light blue gradient
      queue: "linear-gradient(135deg, #f87171, #fca5a5)", // Coral gradient
      heap: "linear-gradient(135deg, #eab308, #facc15)", // Gold gradient
      hashTable: "linear-gradient(135deg, #8b5cf6, #a78bfa)", // Purple gradient
    }[dataStructure]
  }

  const handleAddValue = () => {
    const value = Number.parseInt(newValue)
    if (isNaN(value)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number",
        variant: "destructive",
      })
      return
    }

    setActiveOperation("insert")
    setAnimationStep(0)
    setIsAnimating(true)

    const animationSteps = 5
    let step = 0

    const animationInterval = setInterval(() => {
      setAnimationStep(step)
      step++

      if (step > animationSteps) {
        clearInterval(animationInterval)
        setIsAnimating(false)
        performInsert(value)
      }
    }, 200)
  }

  const performInsert = (value: number) => {
    switch (dataStructure) {
      case "array":
        setArrayData([...arrayData, value])
        break
      case "tree":
        const newNode: Node = { id: (treeData.length + 1).toString(), value }
        const newTreeData = [...treeData]
        const insertNode = (parentId: string) => {
          const parent = newTreeData.find((node) => node.id === parentId)
          if (!parent) return false
          if (value < parent.value) {
            if (!parent.left) {
              parent.left = newNode.id
              return true
            }
            return insertNode(parent.left)
          } else {
            if (!parent.right) {
              parent.right = newNode.id
              return true
            }
            return insertNode(parent.right)
          }
        }
        if (newTreeData.length === 0) {
          newTreeData.push(newNode)
        } else {
          const inserted = insertNode("1")
          if (inserted) {
            newTreeData.push(newNode)
          } else {
            toast({
              title: "Insert failed",
              description: "Could not insert value into tree",
              variant: "destructive",
            })
          }
        }
        setTreeData(newTreeData)
        break
      case "linkedList":
        const newLinkedListNode: LinkedListNode = {
          id: (linkedListData.length + 1).toString(),
          value,
        }
        if (linkedListData.length > 0) {
          linkedListData[linkedListData.length - 1].next = newLinkedListNode.id
        }
        setLinkedListData([...linkedListData, newLinkedListNode])
        break
      case "graph":
        const newGraphNode: GraphNode = {
          id: (graphData.length + 1).toString(),
          value,
          edges: [],
          position: [
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
          ],
        }
        setGraphData([...graphData, newGraphNode])
        break
      case "stack":
        const newStackNode: StackNode = {
          id: (stackData.length + 1).toString(),
          value,
        }
        setStackData([...stackData, newStackNode])
        break
      case "queue":
        const newQueueNode: QueueNode = {
          id: (queueData.length + 1).toString(),
          value,
        }
        setQueueData([...queueData, newQueueNode])
        break
      case "heap":
        const newHeapNode: HeapNode = {
          id: (heapData.length + 1).toString(),
          value,
          position: [0, 0, 0],
        }
        const newHeapData = [...heapData, newHeapNode]
        updateHeapPositions(newHeapData)
        setHeapData(newHeapData)
        break
      case "hashTable":
        if (!newKey.trim()) {
          toast({
            title: "Missing key",
            description: "Please enter a key for the hash table entry",
            variant: "destructive",
          })
          setIsAnimating(false)
          setActiveOperation(null)
          return
        }
        const hash = (key: string) => {
          let hashValue = 0
          for (let i = 0; i < key.length; i++) {
            hashValue += key.charCodeAt(i)
          }
          return hashValue % 10
        }
        const index = hash(newKey)
        const newEntry: HashTableEntry = { key: newKey, value, index }
        const existingEntry = hashTableData.find((entry) => entry.index === index && entry.key === newKey)
        if (existingEntry) {
          toast({
            title: "Key exists",
            description: `Key "${newKey}" already exists at index ${index}.`,
            variant: "destructive",
          })
          setIsAnimating(false)
          setActiveOperation(null)
          return
        }
        setHashTableData([...hashTableData, newEntry])
        setNewKey("")
        break
    }
    setNewValue("")
    setActiveOperation(null)
  }

  const handleDeleteValue = () => {
    if (
      (dataStructure === "array" && arrayData.length === 0) ||
      (dataStructure === "tree" && treeData.length === 0) ||
      (dataStructure === "linkedList" && linkedListData.length === 0) ||
      (dataStructure === "graph" && graphData.length === 0) ||
      (dataStructure === "stack" && stackData.length === 0) ||
      (dataStructure === "queue" && queueData.length === 0) ||
      (dataStructure === "heap" && heapData.length === 0) ||
      (dataStructure === "hashTable" && hashTableData.length === 0)
    ) {
      toast({
        title: "Empty structure",
        description: `The ${dataStructure} is empty. Nothing to delete.`,
        variant: "destructive",
      })
      return
    }

    setActiveOperation("delete")
    setAnimationStep(0)
    setIsAnimating(true)

    const animationSteps = 5
    let step = 0

    const animationInterval = setInterval(() => {
      setAnimationStep(step)
      step++

      if (step > animationSteps) {
        clearInterval(animationInterval)
        setIsAnimating(false)
        performDelete()
      }
    }, 200)
  }

  const performDelete = () => {
    switch (dataStructure) {
      case "array":
        setArrayData(arrayData.slice(0, -1))
        break
      case "tree":
        const leafNodes = treeData.filter((node) => !node.left && !node.right)
        if (leafNodes.length > 0) {
          const nodeToRemove = leafNodes[leafNodes.length - 1]
          const parent = treeData.find((node) => node.left === nodeToRemove.id || node.right === nodeToRemove.id)
          if (parent) {
            if (parent.left === nodeToRemove.id) parent.left = undefined
            else if (parent.right === nodeToRemove.id) parent.right = undefined
          }
          setTreeData(treeData.filter((node) => node.id !== nodeToRemove.id))
        } else if (treeData.length === 1) {
          setTreeData([])
        }
        break
      case "linkedList":
        setLinkedListData(linkedListData.slice(0, -1))
        if (linkedListData.length > 1) {
          linkedListData[linkedListData.length - 2].next = undefined
        }
        break
      case "graph":
        if (graphData.length > 0) {
          const nodeToRemove = graphData[graphData.length - 1]
          const newGraphData = graphData
            .filter((node) => node.id !== nodeToRemove.id)
            .map((node) => ({
              ...node,
              edges: node.edges.filter((edge) => edge !== nodeToRemove.id),
            }))
          setGraphData(newGraphData)
        }
        break
      case "stack":
        setStackData(stackData.slice(0, -1))
        break
      case "queue":
        setQueueData(queueData.slice(1))
        break
      case "heap":
        const newHeapData = heapData.slice(0, -1)
        updateHeapPositions(newHeapData)
        setHeapData(newHeapData)
        break
      case "hashTable":
        setHashTableData(hashTableData.slice(0, -1))
        break
    }
    setActiveOperation(null)
    setSearchResult({ found: false })
  }

  const handleSearch = () => {
    const value = Number.parseInt(searchValue)
    if (isNaN(value)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number to search",
        variant: "destructive",
      })
      return
    }

    setActiveOperation("search")
    setAnimationStep(0)
    setIsAnimating(true)

    const animationSteps = 5
    let step = 0

    const animationInterval = setInterval(() => {
      setAnimationStep(step)
      step++

      if (step > animationSteps) {
        clearInterval(animationInterval)
        setIsAnimating(false)
        performSearch(value)
      }
    }, 200)
  }

  const performSearch = (value: number) => {
    let found = false
    let index: number | undefined = undefined
    let id: string | undefined = undefined

    switch (dataStructure) {
      case "array":
        index = arrayData.findIndex((item) => item === value)
        found = index !== -1
        break
      case "tree":
        const searchTree = (nodeId: string | undefined): string | undefined => {
          if (!nodeId) return undefined
          const node = treeData.find((n) => n.id === nodeId)
          if (!node) return undefined
          if (node.value === value) return node.id
          if (value < node.value) return searchTree(node.left)
          return searchTree(node.right)
        }
        id = searchTree("1")
        found = !!id
        break
      case "linkedList":
        index = linkedListData.findIndex((node) => node.value === value)
        found = index !== -1
        id = found ? linkedListData[index].id : undefined
        break
      case "graph":
        index = graphData.findIndex((node) => node.value === value)
        found = index !== -1
        id = found ? graphData[index].id : undefined
        break
      case "stack":
        index = stackData.findIndex((node) => node.value === value)
        found = index !== -1
        id = found ? stackData[index].id : undefined
        break
      case "queue":
        index = queueData.findIndex((node) => node.value === value)
        found = index !== -1
        id = found ? queueData[index].id : undefined
        break
      case "heap":
        index = heapData.findIndex((node) => node.value === value)
        found = index !== -1
        id = found ? heapData[index].id : undefined
        break
      case "hashTable":
        index = hashTableData.findIndex((entry) => entry.value === value)
        found = index !== -1
        id = found ? hashTableData[index].key : undefined
        break
    }

    setSearchResult({ found, index, id })
    setSearchValue("")
    setActiveOperation(null)

    toast({
      title: found ? "Value found!" : "Value not found",
      description: found
        ? `The value ${value} was found${index !== undefined ? ` at position ${index}` : ""}.`
        : `The value ${value} was not found in the ${dataStructure}.`,
      variant: found ? "default" : "destructive",
    })
  }

  const handleReset = () => {
    switch (dataStructure) {
      case "array":
        setArrayData([10, 20, 30, 40, 50])
        break
      case "tree":
        setTreeData([
          { id: "1", value: 50 },
          { id: "2", value: 30, left: "4", right: "5" },
          { id: "3", value: 70, left: "6", right: "7" },
          { id: "4", value: 20 },
          { id: "5", value: 40 },
          { id: "6", value: 60 },
          { id: "7", value: 80 },
        ])
        break
      case "linkedList":
        setLinkedListData([
          { id: "1", value: 10, next: "2" },
          { id: "2", value: 20, next: "3" },
          { id: "3", value: 30, next: "4" },
          { id: "4", value: 40, next: "5" },
          { id: "5", value: 50 },
        ])
        break
      case "graph":
        setGraphData([
          { id: "1", value: 1, edges: ["2", "3"], position: [0, 0, 0] },
          { id: "2", value: 2, edges: ["1", "4", "5"], position: [2, 1, 0] },
          { id: "3", value: 3, edges: ["1", "5"], position: [-2, 1, 0] },
          { id: "4", value: 4, edges: ["2"], position: [3, -1, 0] },
          { id: "5", value: 5, edges: ["2", "3"], position: [-1, -2, 0] },
        ])
        break
      case "stack":
        setStackData([
          { id: "1", value: 10 },
          { id: "2", value: 20 },
          { id: "3", value: 30 },
          { id: "4", value: 40 },
        ])
        break
      case "queue":
        setQueueData([
          { id: "1", value: 10 },
          { id: "2", value: 20 },
          { id: "3", value: 30 },
          { id: "4", value: 40 },
        ])
        break
      case "heap":
        setHeapData([
          { id: "1", value: 100, position: [0, 3, 0] },
          { id: "2", value: 80, position: [-2, 1.5, 0] },
          { id: "3", value: 70, position: [2, 1.5, 0] },
          { id: "4", value: 50, position: [-3, 0, 0] },
          { id: "5", value: 60, position: [-1, 0, 0] },
          { id: "6", value: 30, position: [1, 0, 0] },
          { id: "7", value: 40, position: [3, 0, 0] },
        ])
        break
      case "hashTable":
        setHashTableData([
          { key: "apple", value: 10, index: 0 },
          { key: "banana", value: 20, index: 1 },
          { key: "orange", value: 30, index: 2 },
          { key: "grape", value: 40, index: 4 },
          { key: "kiwi", value: 50, index: 7 },
        ])
        break
    }
    setSearchResult({ found: false })
    setActiveOperation(null)
    setAnimationStep(0)
    setNewValue("")
    setNewKey("")
    setSearchValue("")
  }

  const handleRandomize = () => {
    switch (dataStructure) {
      case "array":
        setArrayData(Array.from({ length: 5 }, () => Math.floor(Math.random() * 100) + 1))
        break
      case "linkedList":
        setLinkedListData(
          Array.from({ length: 5 }, (_, i) => ({
            id: (i + 1).toString(),
            value: Math.floor(Math.random() * 100) + 1,
            next: i < 4 ? (i + 2).toString() : undefined,
          }))
        )
        break
      case "stack":
        setStackData(
          Array.from({ length: 4 }, (_, i) => ({
            id: (i + 1).toString(),
            value: Math.floor(Math.random() * 100) + 1,
          }))
        )
        break
      case "queue":
        setQueueData(
          Array.from({ length: 4 }, (_, i) => ({
            id: (i + 1).toString(),
            value: Math.floor(Math.random() * 100) + 1,
          }))
        )
        break
      case "tree":
        const randomTree: Node[] = [
          { id: "1", value: Math.floor(Math.random() * 100) + 1 },
          { id: "2", value: Math.floor(Math.random() * 100) + 1, left: "4", right: "5" },
          { id: "3", value: Math.floor(Math.random() * 100) + 1, left: "6", right: "7" },
          { id: "4", value: Math.floor(Math.random() * 100) + 1 },
          { id: "5", value: Math.floor(Math.random() * 100) + 1 },
          { id: "6", value: Math.floor(Math.random() * 100) + 1 },
          { id: "7", value: Math.floor(Math.random() * 100) + 1 },
        ]
        setTreeData(randomTree)
        break
      case "graph":
        setGraphData(
          Array.from({ length: 5 }, (_, i) => ({
            id: (i + 1).toString(),
            value: Math.floor(Math.random() * 100) + 1,
            edges: i < 4 ? [(i + 2).toString()] : [],
            position: [(Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4],
          }))
        )
        break
      case "heap":
        const randomHeap = Array.from({ length: 7 }, (_, i) => ({
          id: (i + 1).toString(),
          value: Math.floor(Math.random() * 100) + 1,
          position: [0, 0, 0] as [number, number, number],
        }))
        updateHeapPositions(randomHeap)
        setHeapData(randomHeap)
        break
      case "hashTable":
        setHashTableData(
          Array.from({ length: 5 }, (_, i) => ({
            key: `key${i + 1}`,
            value: Math.floor(Math.random() * 100) + 1,
            index: i % 10,
          }))
        )
        break
    }
    setSearchResult({ found: false })
    setActiveOperation(null)
    setAnimationStep(0)
    setNewValue("")
    setNewKey("")
    setSearchValue("")
  }

  const updateHeapPositions = (heapData: HeapNode[]) => {
    const levels = Math.ceil(Math.log2(heapData.length + 1))
    const width = Math.pow(2, levels - 1) * 2
    for (let i = 0; i < heapData.length; i++) {
      const level = Math.floor(Math.log2(i + 1))
      const position = i + 1 - Math.pow(2, level)
      const nodesInLevel = Math.pow(2, level)
      const x = (position * width) / nodesInLevel - width / 2 + width / nodesInLevel / 2
      const y = 3 - level * 1.5
      heapData[i].position = [x, y, 0]
    }
  }

  const renderDataStructure = () => {
    return is3D ? render3DDataStructure() : render2DDataStructure()
  }

  const render2DDataStructure = () => {
    switch (dataStructure) {
      case "array":
        return (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 w-full overflow-auto">
            <AnimatePresence>
              {arrayData.map((value, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-xs sm:text-sm md:text-base",
                            activeOperation === "insert" && index === arrayData.length - 1 && animationStep > 0
                              ? "animate-pulse border-2 border-green-400"
                              : activeOperation === "delete" && index === arrayData.length - 1 && animationStep > 0
                                ? "animate-pulse border-2 border-red-400"
                                : "border-2 border-gray-200/50"
                          )}
                          style={{ background: getNodeColor(searchResult.found && searchResult.index === index, index, arrayData.length) }}
                        >
                          {value}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Value: {value}, Index: {index}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="text-xs sm:text-sm text-gray-300 mt-1 sm:mt-2">[{index}]</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )
      case "tree":
        return (
          <div className="flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-auto">
            <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
              {renderTreeNodes(treeData, "1", 400, 50, 300)}
            </svg>
          </div>
        )
      case "linkedList":
        return (
          <div className="flex items-center justify-start sm:justify-center p-2 sm:p-3 md:p-4 w-full overflow-x-auto">
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <AnimatePresence>
                {linkedListData.map((node, index) => (
                  <motion.div
                    key={node.id}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-xs sm:text-sm md:text-base",
                              activeOperation === "insert" && index === linkedListData.length - 1 && animationStep > 0
                                ? "animate-pulse border-2 border-green-400"
                                : activeOperation === "delete" && index === linkedListData.length - 1 && animationStep > 0
                                  ? "animate-pulse border-2 border-red-400"
                                  : "border-2 border-gray-200/50"
                            )}
                            style={{ background: getNodeColor(searchResult.found && searchResult.id === node.id, index, linkedListData.length) }}
                          >
                            {node.value}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Value: {node.value}, ID: {node.id}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {node.next && (
                      <motion.div
                        className="w-6 sm:w-8 md:w-10 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12H19M19 12L12 5M19 12L12 19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-300"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )
      case "graph":
        return (
          <div className="flex items-center justify-center p-2 sm:p-3 md:p-4 w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-auto">
            <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
              {renderGraphEdges()}
              {renderGraphNodes()}
            </svg>
          </div>
        )
      case "stack":
        return (
          <div className="flex flex-col-reverse items-center justify-center p-2 sm:p-3 md:p-4 w-full overflow-auto">
            <div className="border-l-2 border-r-2 border-b-2 border-gray-200/50 w-24 sm:w-28 md:w-32 h-4 rounded-b-md bg-gray-800/50" />
            <AnimatePresence>
              {stackData.map((node, index) => (
                <motion.div
                  key={node.id}
                  className={cn(
                    "w-24 sm:w-28 md:w-32 h-12 sm:h-14 md:h-16 rounded-lg flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-xs sm:text-sm md:text-base",
                    activeOperation === "insert" && index === stackData.length - 1 && animationStep > 0
                      ? "animate-pulse border-2 border-green-400"
                      : activeOperation === "delete" && index === stackData.length - 1 && animationStep > 0
                        ? "animate-pulse border-2 border-red-400"
                        : "border-2 border-gray-200/50",
                    index === stackData.length - 1 ? "rounded-t-lg" : ""
                  )}
                  style={{ background: getNodeColor(searchResult.found && searchResult.id === node.id, index, stackData.length) }}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{node.value}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Value: {node.value}, Top: {index === stackData.length - 1 ? "Yes" : "No"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="text-xs sm:text-sm text-gray-300 mt-1 sm:mt-2">
              {stackData.length > 0 ? "← Top" : "Empty Stack"}
            </div>
          </div>
        )
      case "queue":
        return (
          <div className="flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 w-full overflow-x-auto">
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <div className="text-xs sm:text-sm text-gray-300">Front →</div>
              <div className="border-t-2 border-b-2 border-l-2 border-gray-200/50 w-4 h-12 sm:h-14 md:h-16 rounded-l-md bg-gray-800/50" />
              <AnimatePresence>
                {queueData.map((node, index) => (
                  <motion.div
                    key={node.id}
                    className={cn(
                      "w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-lg flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-xs sm:text-sm md:text-base",
                      activeOperation === "insert" && index === queueData.length - 1 && animationStep > 0
                        ? "animate-pulse border-2 border-green-400"
                        : activeOperation === "delete" && index === 0 && animationStep > 0
                          ? "animate-pulse border-2 border-red-400"
                          : "border-t-2 border-b-2 border-gray-200/50",
                      index === queueData.length - 1 ? "border-r-2 rounded-r-lg" : ""
                    )}
                    style={{ background: getNodeColor(searchResult.found && searchResult.id === node.id, index, queueData.length) }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{node.value}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Value: {node.value}, Position: {index === 0 ? "Front" : index === queueData.length - 1 ? "Back" : "Middle"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="border-t-2 border-b-2 border-r-2 border-gray-200/50 w-4 h-12 sm:h-14 md:h-16 rounded-r-md bg-gray-800/50" />
              <div className="text-xs sm:text-sm text-gray-300">← Back</div>
            </div>
          </div>
        )
      case "heap":
        return (
          <div className="flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-auto">
            <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
              {renderHeapNodes(heapData)}
            </svg>
          </div>
        )
      case "hashTable":
        return (
          <div className="flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 w-full overflow-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-xl flex items-center justify-center text-white shadow-lg border-2 border-gray-200/50 bg-gray-800/50 text-xs sm:text-sm md:text-base">
                    {index}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 mt-1 sm:mt-2">Index</div>
                  <AnimatePresence>
                    {hashTableData
                      .filter((entry) => entry.index === index)
                      .map((entry) => (
                        <motion.div
                          key={entry.key}
                          className="flex flex-col items-center mt-2"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={cn(
                                    "w-16 sm:w-20 md:w-24 h-12 sm:h-14 md:h-16 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-xs sm:text-sm",
                                    activeOperation === "insert" &&
                                      hashTableData[hashTableData.length - 1]?.key === entry.key &&
                                      animationStep > 0
                                      ? "animate-pulse border-2 border-green-400"
                                      : activeOperation === "delete" &&
                                        hashTableData[hashTableData.length - 1]?.key === entry.key &&
                                        animationStep > 0
                                        ? "animate-pulse border-2 border-red-400"
                                        : "border-2 border-gray-200/50"
                                  )}
                                  style={{ background: getNodeColor(searchResult.found && searchResult.id === entry.key, index, hashTableData.length) }}
                                >
                                  {entry.key}: {entry.value}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Key: {entry.key}, Value: {entry.value}, Index: {entry.index}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const render3DDataStructure = () => {
    switch (dataStructure) {
      case "array":
        return (
          <div ref={canvasContainerRef} className="w-full h-[400px] sm:h-[500px] md:h-[600px]">
            <Canvas
              style={{ width: canvasSize.width, height: canvasSize.height }}
              camera={{ position: [0, 5, 15], fov: 60 }}
              gl={{ preserveDrawingBuffer: true }}
            >
              <OrbitControls enableDamping dampingFactor={0.05} />
              <ambientLight intensity={1} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
              {arrayData.map((value, index) => (
                <Box
                  key={index}
                  position={[index * 2 - (arrayData.length - 1), 0, 0]}
                  args={[1.5, 1.5, 1.5]}
                  castShadow
                  receiveShadow
                >
                  <meshStandardMaterial
                    color={searchResult.found && searchResult.index === index ? "#22c55e" : "#f97316"}
                    roughness={0.3}
                    metalness={0.4}
                    emissive={searchResult.found && searchResult.index === index ? "#22c55e" : "#000000"}
                    emissiveIntensity={0.2}
                  />
                  <Text position={[0, 0, 0.76]} color="white" fontSize={0.8} anchorX="center" anchorY="middle">
                    {value}
                  </Text>
                </Box>
              ))}
            </Canvas>
          </div>
        )
      case "tree":
        return (
          <div ref={canvasContainerRef} className="w-full h-[400px] sm:h-[500px] md:h-[600px]">
            <Canvas
              style={{ width: canvasSize.width, height: canvasSize.height }}
              camera={{ position: [0, 5, 15], fov: 60 }}
              gl={{ preserveDrawingBuffer: true }}
            >
              <OrbitControls enableDamping dampingFactor={0.05} />
              <ambientLight intensity={1} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
              {render3DTreeNodes(treeData, "1", [0, 5, 0])}
            </Canvas>
          </div>
        )
      case "graph":
        return (
          <div ref={canvasContainerRef} className="w-full h-[400px] sm:h-[500px] md:h-[600px]">
            <Canvas
              style={{ width: canvasSize.width, height: canvasSize.height }}
              camera={{ position: [0, 5, 15], fov: 60 }}
              gl={{ preserveDrawingBuffer: true }}
            >
              <OrbitControls enableDamping dampingFactor={0.05} />
              <ambientLight intensity={1} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
              {graphData.map((node, index) => (
                <Sphere
                  key={node.id}
                  position={node.position || [0, 0, 0]}
                  args={[0.8, 32, 32]}
                  castShadow
                  receiveShadow
                >
                  <meshStandardMaterial
                    color={searchResult.found && searchResult.id === node.id ? "#22c55e" : "#0ea5e9"}
                    roughness={0.3}
                    metalness={0.4}
                    emissive={searchResult.found && searchResult.id === node.id ? "#22c55e" : "#000000"}
                    emissiveIntensity={0.2}
                  />
                  <Text position={[0, 0, 0.9]} color="white" fontSize={0.5} anchorX="center" anchorY="middle">
                    {node.value}
                  </Text>
                </Sphere>
              ))}
              {render3DGraphEdges()}
            </Canvas>
          </div>
        )
      case "linkedList":
        return (
          <div ref={canvasContainerRef} className="w-full h-[400px] sm:h-[500px] md:h-[600px]">
            <Canvas
              style={{ width: canvasSize.width, height: canvasSize.height }}
              camera={{ position: [0, 5, 15], fov: 60 }}
              gl={{ preserveDrawingBuffer: true }}
            >
              <OrbitControls enableDamping dampingFactor={0.05} />
              <ambientLight intensity={1} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
              {linkedListData.map((node, index) => (
                <Box
                  key={node.id}
                  position={[index * 2.5 - (linkedListData.length - 1) * 1.25, 0, 0]}
                  args={[1.5, 1.5, 1.5]}
                  castShadow
                  receiveShadow
                >
                  <meshStandardMaterial
                    color={searchResult.found && searchResult.id === node.id ? "#22c55e" : "#22c55e"}
                    roughness={0.3}
                    metalness={0.4}
                    emissive={searchResult.found && searchResult.id === node.id ? "#22c55e" : "#000000"}
                    emissiveIntensity={0.2}
                  />
                  <Text position={[0, 0, 0.76]} color="white" fontSize={0.8} anchorX="center" anchorY="middle">
                    {node.value}
                  </Text>
                </Box>
              ))}
              {linkedListData.slice(0, -1).map((node, index) => {
                const nextNode = linkedListData[index + 1]
                return (
                  <Line
                    key={`${node.id}-${nextNode.id}`}
                    points={[
                      [index * 2.5 - (linkedListData.length - 1) * 1.25 + 0.75, 0, 0],
                      [(index + 1) * 2.5 - (linkedListData.length - 1) * 1.25 - 0.75, 0, 0],
                    ]}
                    color="#9ca3af"
                    lineWidth={5}
                  />
                )
              })}
            </Canvas>
          </div>
        )
      case "stack":
        return (
          <div ref={canvasContainerRef} className="w-full h-[400px] sm:h-[500px] md:h-[600px]">
            <Canvas
              style={{ width: canvasSize.width, height: canvasSize.height }}
              camera={{ position: [0, 5, 15], fov: 60 }}
              gl={{ preserveDrawingBuffer: true }}
            >
              <OrbitControls enableDamping dampingFactor={0.05} />
              <ambientLight intensity={1} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
              {stackData.map((node, index) => (
                <Box
                  key={node.id}
                  position={[0, index * 1.5 - (stackData.length - 1) * 0.75, 0]}
                  args={[1.5, 1.5, 1.5]}
                  castShadow
                  receiveShadow
                >
                  <meshStandardMaterial
                    color={searchResult.found && searchResult.id === node.id ? "#22c55e" : "#3b82f6"}
                    roughness={0.3}
                    metalness={0.4}
                    emissive={searchResult.found && searchResult.id === node.id ? "#22c55e" : "#000000"}
                    emissiveIntensity={0.2}
                  />
                  <Text position={[0, 0, 0.76]} color="white" fontSize={0.8} anchorX="center" anchorY="middle">
                    {node.value}
                  </Text>
                </Box>
              ))}
            </Canvas>
          </div>
        )
      case "queue":
        return (
          <div ref={canvasContainerRef} className="w-full h-[400px] sm:h-[500px] md:h-[600px]">
            <Canvas
              style={{ width: canvasSize.width, height: canvasSize.height }}
              camera={{ position: [0, 5, 15], fov: 60 }}
              gl={{ preserveDrawingBuffer: true }}
            >
              <OrbitControls enableDamping dampingFactor={0.05} />
              <ambientLight intensity={1} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
              {queueData.map((node, index) => (
                <Box
                  key={node.id}
                  position={[index * 2.5 - (queueData.length - 1) * 1.25, 0, 0]}
                  args={[1.5, 1.5, 1.5]}
                  castShadow
                  receiveShadow
                >
                  <meshStandardMaterial
                    color={searchResult.found && searchResult.id === node.id ? "#22c55e" : "#f87171"}
                    roughness={0.3}
                    metalness={0.4}
                    emissive={searchResult.found && searchResult.id === node.id ? "#22c55e" : "#000000"}
                    emissiveIntensity={0.2}
                  />
                  <Text position={[0, 0, 0.76]} color="white" fontSize={0.8} anchorX="center" anchorY="middle">
                    {node.value}
                  </Text>
                </Box>
              ))}
            </Canvas>
          </div>
        )
      case "heap":
        return (
          <div ref={canvasContainerRef} className="w-full h-[400px] sm:h-[500px] md:h-[600px]">
            <Canvas
              style={{ width: canvasSize.width, height: canvasSize.height }}
              camera={{ position: [0, 5, 15], fov: 60 }}
              gl={{ preserveDrawingBuffer: true }}
            >
              <OrbitControls enableDamping dampingFactor={0.05} />
              <ambientLight intensity={1} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
              {heapData.map((node, index) => (
                <Sphere
                  key={node.id}
                  position={node.position ? [node.position[0] * 2, node.position[1] * 2, node.position[2]] : [0, 0, 0]}
                  args={[0.8, 32, 32]}
                  castShadow
                  receiveShadow
                >
                  <meshStandardMaterial
                    color={searchResult.found && searchResult.id === node.id ? "#22c55e" : "#eab308"}
                    roughness={0.3}
                    metalness={0.4}
                    emissive={searchResult.found && searchResult.id === node.id ? "#22c55e" : "#000000"}
                    emissiveIntensity={0.2}
                  />
                  <Text position={[0, 0, 0.9]} color="white" fontSize={0.5} anchorX="center" anchorY="middle">
                    {node.value}
                  </Text>
                </Sphere>
              ))}
            </Canvas>
          </div>
        )
      case "hashTable":
        return (
          <div ref={canvasContainerRef} className="w-full h-[400px] sm:h-[500px] md:h-[600px]">
            <Canvas
              style={{ width: canvasSize.width, height: canvasSize.height }}
              camera={{ position: [0, 5, 15], fov: 60 }}
              gl={{ preserveDrawingBuffer: true }}
            >
              <OrbitControls enableDamping dampingFactor={0.05} />
              <ambientLight intensity={1} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
              {hashTableData.map((entry, index) => (
                <Box
                  key={entry.key}
                  position={[entry.index * 2.5 - 11.25, 0, 0]}
                  args={[1.5, 1.5, 1.5]}
                  castShadow
                  receiveShadow
                >
                  <meshStandardMaterial
                    color={searchResult.found && searchResult.id === entry.key ? "#22c55e" : "#8b5cf6"}
                    roughness={0.3}
                    metalness={0.4}
                    emissive={searchResult.found && searchResult.id === entry.key ? "#22c55e" : "#000000"}
                    emissiveIntensity={0.2}
                  />
                  <Text position={[0, 0, 0.76]} color="white" fontSize={0.5} anchorX="center" anchorY="middle">
                    {entry.key}: {entry.value}
                  </Text>
                </Box>
              ))}
            </Canvas>
          </div>
        )
      default:
        return null
    }
  }

  const render3DTreeNodes = (
    nodes: Node[],
    nodeId: string | undefined,
    position: [number, number, number],
  ): JSX.Element | null => {
    if (!nodeId) return null
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return null
    return (
      <group key={node.id}>
        <Sphere position={position} args={[0.8, 32, 32]} castShadow receiveShadow>
          <meshStandardMaterial
            color={searchResult.found && searchResult.id === node.id ? "#22c55e" : "#22c55e"}
            roughness={0.3}
            metalness={0.4}
            emissive={searchResult.found && searchResult.id === node.id ? "#22c55e" : "#000000"}
            emissiveIntensity={0.2}
          />
          <Text position={[0, 0, 0.9]} color="white" fontSize={0.5} anchorX="center" anchorY="middle">
            {node.value}
          </Text>
        </Sphere>
        {node.left && (
          <>
            <Line
              points={[position, [position[0] - 3, position[1] - 3, position[2]]]}
              color="#9ca3af"
              lineWidth={5}
            />
            {render3DTreeNodes(nodes, node.left, [position[0] - 3, position[1] - 3, position[2]])}
          </>
        )}
        {node.right && (
          <>
            <Line
              points={[position, [position[0] + 3, position[1] - 3, position[2]]]}
              color="#9ca3af"
              lineWidth={5}
            />
            {render3DTreeNodes(nodes, node.right, [position[0] + 3, position[1] - 3, position[2]])}
          </>
        )}
      </group>
    )
  }

  const render3DGraphEdges = () => {
    const edges: JSX.Element[] = []
    graphData.forEach((node) => {
      node.edges.forEach((targetId) => {
        const targetNode = graphData.find((n) => n.id === targetId)
        if (targetNode && node.id < targetNode.id) {
          edges.push(
            <Line
              key={`${node.id}-${targetId}`}
              points={[node.position || [0, 0, 0], targetNode.position || [0, 0, 0]]}
              color="#9ca3af"
              lineWidth={5}
            />,
          )
        }
      })
    })
    return edges
  }

  const renderTreeNodes = (
    nodes: Node[],
    nodeId: string | undefined,
    x: number,
    y: number,
    width: number,
  ): JSX.Element[] => {
    if (!nodeId) return []
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return []
    const elements: JSX.Element[] = []
    const nodeRadius = canvasSize.width < 640 ? 20 : 25
    elements.push(
      <motion.g
        key={node.id}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <g>
                <circle
                  cx={x}
                  cy={y}
                  r={nodeRadius}
                  fill={getNodeColor(searchResult.found && searchResult.id === node.id, undefined, treeData.length)}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="2"
                  className="shadow-lg hover:shadow-xl transition-all duration-300"
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={canvasSize.width < 640 ? "12" : "14"}
                  className="font-semibold"
                >
                  {node.value}
                </text>
              </g>
            </TooltipTrigger>
            <TooltipContent>
              <p>Value: {node.value}, ID: {node.id}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.g>,
    )
    if (node.left) {
      const leftX = x - width / 2
      const leftY = y + 80
      elements.push(
        <motion.line
          key={`${node.id}-${node.left}`}
          x1={x}
          y1={y + nodeRadius}
          x2={leftX}
          y2={leftY - nodeRadius}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />,
      )
      elements.push(...renderTreeNodes(nodes, node.left, leftX, leftY, width / 2))
    }
    if (node.right) {
      const rightX = x + width / 2
      const rightY = y + 80
      elements.push(
        <motion.line
          key={`${node.id}-${node.right}`}
          x1={x}
          y1={y + nodeRadius}
          x2={rightX}
          y2={rightY - nodeRadius}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />,
      )
      elements.push(...renderTreeNodes(nodes, node.right, rightX, rightY, width / 2))
    }
    return elements
  }

  const renderGraphNodes = () => {
    const nodes = graphData.map((node, index) => {
      const x = ((node.position?.[0] || 0) + 5) * 60
      const y = ((node.position?.[1] || 0) + 3) * 60
      return (
        <motion.g
          key={node.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <g>
                  <circle
                    cx={x}
                    cy={y}
                    r={canvasSize.width < 640 ? 20 : 25}
                    fill={getNodeColor(searchResult.found && searchResult.id === node.id, index, graphData.length)}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="2"
                    className="shadow-lg hover:shadow-xl transition-all duration-300"
                  />
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={canvasSize.width < 640 ? "12" : "14"}
                    className="font-semibold"
                  >
                    {node.value}
                  </text>
                </g>
              </TooltipTrigger>
              <TooltipContent>
                <p>Value: {node.value}, ID: {node.id}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.g>
      )
    })
    return nodes
  }

  const renderGraphEdges = () => {
    const edges: JSX.Element[] = []
    graphData.forEach((node) => {
      node.edges.forEach((targetId) => {
        const targetNode = graphData.find((n) => n.id === targetId)
        if (targetNode && node.id < targetId) {
          const x1 = ((node.position?.[0] || 0) + 5) * 60
          const y1 = ((node.position?.[1] || 0) + 3) * 60
          const x2 = ((targetNode.position?.[0] || 0) + 5) * 60
          const y2 = ((targetNode.position?.[1] || 0) + 3) * 60
          edges.push(
            <motion.line
              key={`${node.id}-${targetId}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />,
          )
        }
      })
    })
    return edges
  }

  const renderHeapNodes = (nodes: HeapNode[]) => {
    const elements: JSX.Element[] = []
    nodes.forEach((node, index) => {
      const x = (node.position?.[0] || 0) * 100 + 400
      const y = (node.position?.[1] || 0) * -80 + 300
      elements.push(
        <motion.g
          key={node.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <g>
                  <circle
                    cx={x}
                    cy={y}
                    r={canvasSize.width < 640 ? 20 : 25}
                    fill={getNodeColor(searchResult.found && searchResult.id === node.id, index, nodes.length)}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="2"
                    className="shadow-lg hover:shadow-xl transition-all duration-300"
                  />
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={canvasSize.width < 640 ? "12" : "14"}
                    className="font-semibold"
                  >
                    {node.value}
                  </text>
                </g>
              </TooltipTrigger>
              <TooltipContent>
                <p>Value: {node.value}, ID: {node.id}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.g>,
      )
      const parentIndex = Math.floor((index - 1) / 2)
      if (index > 0) {
        const parent = nodes[parentIndex]
        const parentX = (parent.position?.[0] || 0) * 100 + 400
        const parentY = (parent.position?.[1] || 0) * -80 + 300
        elements.push(
          <motion.line
            key={`${node.id}-parent`}
            x1={x}
            y1={y}
            x2={parentX}
            y2={parentY}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />,
        )
      }
    })
    return elements
  }

  const handleColorModeChange = (mode: "default" | "rainbow" | "heat" | "pastel") => {
    setCurrentColorMode(mode)
  }

  const renderDetails = () => {
    const info = dataStructureInfo[dataStructure]
    return (
      <div className="mt-4 p-4 sm:p-6 bg-gray-800/50 rounded-xl shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 capitalize">{dataStructure} Details</h2>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-800 p-2 rounded-lg w-full overflow-x-auto">
            <TabsTrigger
              value="overview"
              className="py-2 px-3 text-xs sm:text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200 whitespace-nowrap"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="complexity"
              className="py-2 px-3 text-xs sm:text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200 whitespace-nowrap"
            >
              Complexity
            </TabsTrigger>
            <TabsTrigger
              value="pros-cons"
              className="py-2 px-3 text-xs sm:text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200 whitespace-nowrap"
            >
              Pros & Cons
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="py-2 px-3 text-xs sm:text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200 whitespace-nowrap"
            >
              Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="space-y-6 p-4 bg-gray-900 rounded-lg">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Definition</h3>
                <p className="text-gray-300 text-sm sm:text-base">{info.definition}</p>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Why Use It?</h3>
                <p className="text-gray-300 text-sm sm:text-base">{info.why}</p>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">When to Use?</h3>
                <p className="text-gray-300 text-sm sm:text-base">{info.when}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="complexity" className="mt-4">
            <div className="space-y-6 p-4 bg-gray-900 rounded-lg">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Time Complexity</h3>
                <ul className="list-disc list-inside text-gray-300 text-sm sm:text-base">
                  <li>Access: {info.timeComplexity.access}</li>
                  <li>Search: {info.timeComplexity.search}</li>
                  <li>Insert: {info.timeComplexity.insert}</li>
                  <li>Delete: {info.timeComplexity.delete}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Space Complexity</h3>
                <p className="text-gray-300 text-sm sm:text-base">{info.spaceComplexity}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pros-cons" className="mt-4">
            <div className="space-y-6 p-4 bg-gray-900 rounded-lg">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Advantages</h3>
                <ul className="list-disc list-inside text-gray-300 text-sm sm:text-base">
                  {info.advantages.map((advantage, index) => (
                    <li key={index}>{advantage}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Disadvantages</h3>
                <ul className="list-disc list-inside text-gray-300 text-sm sm:text-base">
                  {info.disadvantages.map((disadvantage, index) => (
                    <li key={index}>{disadvantage}</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="mt-4">
            <div className="space-y-6 p-4 bg-gray-900 rounded-lg">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Example Problems</h3>
                <ul className="list-disc list-inside text-gray-300 text-sm sm:text-base">
                  {info.exampleProblems.map((problem, index) => (
                    <li key={index}>{problem}</li>
                  ))}
                  {/* Note: "prescription drug names" seems like a stray text in the original; removed unless it's intentional */}
                </ul>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Real-World Applications</h3>
                <ul className="list-disc list-inside text-gray-300 text-sm sm:text-base">
                  {info.realWorldApplications.map((application, index) => (
                    <li key={index}>{application}</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <Card className="w-full bg-gray-900/50 border-gray-800 shadow-xl">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white capitalize">{dataStructure} Visualizer</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowDetails(!showDetails)}
                    className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
                  >
                    <Info className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showDetails ? "Hide" : "Show"} Details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleReset}
                    className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
                    disabled={isAnimating}
                  >
                    <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset Data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRandomize}
                    className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
                    disabled={isAnimating}
                  >
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Randomize Data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleColorModeChange(
                        currentColorMode === "default"
                          ? "rainbow"
                          : currentColorMode === "rainbow"
                            ? "heat"
                            : currentColorMode === "heat"
                              ? "pastel"
                              : "default",
                      )
                    }
                    className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
                  >
                    <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change Color Mode: {currentColorMode}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex flex-1 gap-2 sm:gap-3">
            {dataStructure === "hashTable" && (
              <Input
                type="text"
                placeholder="Key"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="bg-gray-800 text-white border-gray-600 focus:border-blue-500 w-24 sm:w-32"
                disabled={isAnimating}
              />
            )}
            <Input
              type="number"
              placeholder="Value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="bg-gray-800 text-white border-gray-600 focus:border-blue-500 w-24 sm:w-32"
              disabled={isAnimating}
            />
            <Button
              onClick={handleAddValue}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isAnimating}
            >
              <Plus className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Add
            </Button>
            <Button
              onClick={handleDeleteValue}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isAnimating}
            >
              <Trash className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Delete
            </Button>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Input
              type="number"
              placeholder="Search value"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-gray-800 text-white border-gray-600 focus:border-blue-500 w-24 sm:w-32"
              disabled={isAnimating}
            />
            <Button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isAnimating}
            >
              <Search className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Search
            </Button>
          </div>
        </div>
        <div
          className="relative rounded-lg overflow-hidden shadow-lg"
          style={{ height: `${height}px`, minHeight: "300px" }}
        >
          {renderDataStructure()}
        </div>
        {showDetails && renderDetails()}
      </CardContent>
    </Card>
  )
}
