"use client"

import { ChevronDown, ChevronUp, Users, X } from "lucide-react"
import { useRef, useState } from "react"

const PRIMARY_NAVY = "#1B436D"
const ACCENT_YELLOW = "#FDBB2D"
const GREEN_LOGGED_IN = "#1D9E74"
const YELLOW_REFERRED = "#FDBB2D"

const NAMES = [
  "Arjun Kumar",
  "Priya Singh",
  "Rajesh Patel",
  "Ananya Gupta",
  "Vikram Sharma",
  "Neha Reddy",
  "Aditya Kapoor",
  "Divya Iyer",
  "Harsh Verma",
  "Pooja Nair",
  "Sanjay Roy",
  "Isha Banerjee",
  "Rohan Chopra",
  "Maya Malhotra",
  "Karan Desai",
  "Zara Mehta",
  "Nikhil Rao",
  "Shreya Joshi",
  "Akshay Kulkarni",
  "Riya Saxena",
  "Abhishek Singh",
  "Sonam Patel",
  "Vihaan Sharma",
  "Nisha Kapoor",
  "Arun Iyer",
  "Sneha Gupta",
  "Deepak Verma",
  "Anjali Nair",
  "Varun Desai",
  "Kavya Sharma",
  "Manish Patel",
  "Ritika Verma",
  "Siddharth Gupta",
  "Meera Nair",
  "Prateek Roy",
  "Anjana Singh",
  "Rahul Kapoor",
  "Swati Iyer",
  "Vikas Kumar",
  "Neelam Desai",
  "Sandeep Chopra",
  "Eesha Malhotra",
  "Aryan Rao",
  "Divyanshu Joshi",
  "Naman Saxena",
]

const generateBinaryTreeData = () => {
  let counter = 1000

  const createNode = (depth = 0, maxDepth = 4) => {
    if (depth >= maxDepth) return null

    const name = NAMES[Math.floor(Math.random() * NAMES.length)]
    const id = `REF-${counter++}`
    const isReferred = depth > 0

    const probability = 0.8 - depth * 0.15
    const hasLeft = Math.random() < probability
    const hasRight = Math.random() < probability

    return {
      id,
      name,
      email: name.toLowerCase().replace(" ", ".") + "@email.com",
      isReferred,
      left: hasLeft ? createNode(depth + 1, maxDepth) : null,
      right: hasRight ? createNode(depth + 1, maxDepth) : null,
    }
  }

  return {
    id: "USER-001",
    name: "You",
    email: "you@email.com",
    isReferred: false,
    left: createNode(1, 4),
    right: createNode(1, 4),
  }
}

const TreeNode = ({ node, onToggle, expanded, level = 0 }) => {
  if (!node) return null

  const hasChildren = node.left || node.right
  const isExpanded = expanded.has(node.id)
  const isRoot = !node.isReferred

  const bgColor = isRoot ? GREEN_LOGGED_IN : YELLOW_REFERRED

  const sizes = {
    0: { card: "w-44 px-4 py-3", text: "text-sm", avatar: "w-11 h-11", gap: "gap-3" },
    1: { card: "w-40 px-3 py-2.5", text: "text-xs", avatar: "w-10 h-10", gap: "gap-2.5" },
    2: { card: "w-36 px-3 py-2", text: "text-xs", avatar: "w-9 h-9", gap: "gap-2" },
    3: { card: "w-32 px-2.5 py-2", text: "text-xs", avatar: "w-8 h-8", gap: "gap-2" },
    4: { card: "w-28 px-2 py-1.5", text: "text-xs", avatar: "w-7 h-7", gap: "gap-1.5" },
  }

  const currentSize = sizes[Math.min(level, 4)]

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`${currentSize.card} rounded-xl transition-all duration-300 cursor-pointer border-3 border-white shadow-xl hover:shadow-2xl hover:scale-110 transform relative group`}
        style={{
          backgroundColor: bgColor,
          transformOrigin: "top center",
        }}
        onClick={() => hasChildren && onToggle(node.id)}
      >
        <div className={`flex items-center ${currentSize.gap}`}>
          <div
            className={`${currentSize.avatar} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 border-3 border-white text-xs shadow-md`}
            style={{ backgroundColor: `${bgColor}95` }}
          >
            {node.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <p className={`${currentSize.text} font-bold text-white truncate leading-tight`}>{node.name}</p>
            <p className="text-xs opacity-85 font-mono truncate text-white leading-tight">{node.id}</p>
          </div>
        </div>

        {hasChildren && (
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" style={{ color: bgColor }} />
            ) : (
              <ChevronDown className="w-4 h-4" style={{ color: bgColor }} />
            )}
          </div>
        )}
      </div>

      {/* Children Container */}
      {hasChildren && isExpanded && (
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          {/* Vertical connector */}
          <div
            className="w-1.5 bg-gradient-to-b from-slate-400 to-slate-300 rounded-full"
            style={{ height: level < 2 ? "24px" : "20px" }}
          ></div>

          {/* Left and Right children wrapper */}
          <div className="flex gap-6 sm:gap-8 md:gap-12 items-start">
            {/* Left Branch */}
            {node.left && (
              <div className="flex flex-col items-center relative">
                {/* Connecting line for left child */}
                <div
                  className="absolute bottom-full left-full transform translate-y-full -translate-x-full border-l-3 border-b-3 border-slate-400 rounded-bl-2xl"
                  style={{
                    width: level < 2 ? "40px" : "32px",
                    height: level < 2 ? "28px" : "24px",
                  }}
                ></div>

                <div className="mb-2 px-2.5 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
                  ← LEFT
                </div>

                <TreeNode node={node.left} onToggle={onToggle} expanded={expanded} level={level + 1} />
              </div>
            )}

            {/* Right Branch */}
            {node.right && (
              <div className="flex flex-col items-center relative">
                {/* Connecting line for right child */}
                <div
                  className="absolute bottom-full right-full transform translate-y-full translate-x-full border-r-3 border-b-3 border-slate-400 rounded-br-2xl"
                  style={{
                    width: level < 2 ? "40px" : "32px",
                    height: level < 2 ? "28px" : "24px",
                  }}
                ></div>

                <div className="mb-2 px-2.5 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
                  RIGHT →
                </div>

                <TreeNode node={node.right} onToggle={onToggle} expanded={expanded} level={level + 1} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ReferralTreeModal({ isOpen, onClose }) {
  const [treeData] = useState(() => generateBinaryTreeData())
  const [expandedNodes, setExpandedNodes] = useState(new Set(["USER-001"]))
  const scrollContainerRef = useRef(null)

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm" onClick={onClose}></div>

      <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col border-3"
          style={{ borderColor: ACCENT_YELLOW }}
        >
          <div
            className="px-4 sm:px-6 py-3 border-b-2 flex-shrink-0"
            style={{
              backgroundColor: PRIMARY_NAVY,
              borderColor: ACCENT_YELLOW,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Users className="w-6 h-6 text-white flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-white truncate">Binary Referral Network</h2>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all flex-shrink-0"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Tree Container - Scrollable */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-auto p-6 sm:p-8 md:p-12 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50"
          >
            <div className="flex justify-center">
              <TreeNode node={treeData} onToggle={toggleNode} expanded={expandedNodes} />
            </div>
          </div>

          <div
            className="px-4 sm:px-6 py-3 border-t-2 bg-white flex-shrink-0 flex items-center gap-4 sm:gap-6 text-xs overflow-x-auto"
            style={{ borderColor: ACCENT_YELLOW }}
          >
            <span className="font-bold text-slate-800 uppercase whitespace-nowrap">Legend:</span>

            <div className="flex items-center gap-2 whitespace-nowrap">
              <div
                className="w-4 h-4 rounded-full border-2 border-white flex-shrink-0 shadow-sm"
                style={{ backgroundColor: GREEN_LOGGED_IN }}
              ></div>
              <span className="text-slate-700 font-medium">You</span>
            </div>

            <div className="flex items-center gap-2 whitespace-nowrap">
              <div
                className="w-4 h-4 rounded-full border-2 border-white flex-shrink-0 shadow-sm"
                style={{ backgroundColor: YELLOW_REFERRED }}
              ></div>
              <span className="text-slate-700 font-medium">Referrals</span>
            </div>

            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0 shadow-sm"></div>
              <span className="text-slate-700 font-medium">Left Leg</span>
            </div>

            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex-shrink-0 shadow-sm"></div>
              <span className="text-slate-700 font-medium">Right Leg</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
