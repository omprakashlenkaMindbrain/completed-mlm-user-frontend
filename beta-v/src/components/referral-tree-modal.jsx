import { ChevronDown, ChevronUp, Loader, Users, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import BASE_URL from "../config/api"
import { useAuth } from "../context/AuthContext"

const PRIMARY_NAVY = "#0F172A"
const ACCENT_YELLOW = "#FDBB2D"
const GREEN_LOGGED_IN = "#16A34A"
const YELLOW_REFERRED = "#FACC15"

//
// AUTO-SHRINK NODE SIZES BY DEPTH
//
const getResponsiveSize = (level) => {
  const scale = Math.max(0.35, 1 - level * 0.06)  // decreases smoothly per level

  return {
    scale,
    cardPadding: `${8 * scale}px ${12 * scale}px`,
    avatar: `${40 * scale}px`,
    nameSize: `${14 * scale}px`,
    idSize: `${10 * scale}px`,
    gap: `${6 * scale}px`,
  }
}

//
// TRANSFORM API NODE
//
const transformApiNode = (apiNode, depth = 0) => {
  if (!apiNode) return null

  return {
    id: apiNode.memId,
    name: apiNode.name,
    memId: apiNode.memId,
    isReferred: depth > 0,
    left: transformApiNode(apiNode.leftLeg, depth + 1),
    right: transformApiNode(apiNode.rightLeg, depth + 1),
  }
}

//
// TREE NODE COMPONENT
//
const TreeNode = ({ node, onToggle, expanded, level = 0 }) => {
  if (!node) return null

  const hasChildren = node.left || node.right
  const isExpanded = expanded.has(node.id)
  const isRoot = !node.isReferred
  const bgColor = isRoot ? GREEN_LOGGED_IN : YELLOW_REFERRED

  const size = getResponsiveSize(level)

  return (
    <div className="flex flex-col items-center">
      {level > 0 && <div className="w-px h-6 bg-slate-300 mb-2" />}

      <div className="relative flex flex-col items-center">
        <div
          className="rounded-xl border border-white/80 shadow-xl cursor-pointer group transition-all"
          style={{
            transform: `scale(${size.scale})`,
            background: `linear-gradient(135deg, ${bgColor}, ${bgColor}cc)`,
            padding: size.cardPadding,
          }}
          onClick={() => hasChildren && onToggle(node.id)}
        >
          <div className="flex items-center" style={{ gap: size.gap }}>
            <div
              className="rounded-full flex items-center justify-center font-bold text-white border border-white/70 shadow-md"
              style={{
                width: size.avatar,
                height: size.avatar,
                backgroundColor: `${bgColor}aa`,
                fontSize: size.nameSize,
              }}
            >
              {node.name?.split(" ").map((n) => n[0]).join("")}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="font-semibold text-white truncate leading-tight"
                style={{ fontSize: size.nameSize }}
              >
                {node.name}
              </p>
              <p
                className="text-white/90 font-mono truncate leading-tight"
                style={{ fontSize: size.idSize }}
              >
                {node.id}
              </p>
            </div>
          </div>

          {hasChildren && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" style={{ color: bgColor }} />
              ) : (
                <ChevronDown className="w-4 h-4" style={{ color: bgColor }} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* CHILDREN */}
      {hasChildren && isExpanded && (
        <div className="mt-6">
          <div className="flex justify-center">
            <div className="w-px h-6 bg-slate-300" />
          </div>

          <div className="relative mt-1 flex items-start justify-center">
            <div className="absolute top-0 left-0 right-0 h-px bg-slate-300" />

            {node.left && (
              <div className="flex flex-col items-center mr-10 pt-3">
                <div className="w-px h-4 bg-slate-300 mb-1" />
                <span className="mb-2 px-2 py-0.5 rounded-full bg-blue-600 text-[10px] text-white">
                  LEFT
                </span>
                <TreeNode node={node.left} onToggle={onToggle} expanded={expanded} level={level + 1} />
              </div>
            )}

            {node.right && (
              <div className="flex flex-col items-center ml-10 pt-3">
                <div className="w-px h-4 bg-slate-300 mb-1" />
                <span className="mb-2 px-2 py-0.5 rounded-full bg-purple-600 text-[10px] text-white">
                  RIGHT
                </span>
                <TreeNode node={node.right} onToggle={onToggle} expanded={expanded} level={level + 1} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

//
// MAIN MODAL
//
export default function ReferralTreeModal({ isOpen, onClose, loggedInUserId }) {
  const [treeData, setTreeData] = useState(null)
  const [expandedNodes, setExpandedNodes] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  const { getaccesstoken } = useAuth()

  // ZOOM + PAN STATES
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })

  //
  // FETCH TREE
  //
  useEffect(() => {
    if (!isOpen || !loggedInUserId) return

    const fetchTreeData = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = getaccesstoken

        const res = await fetch(`${BASE_URL}/api/showdownline/${loggedInUserId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Failed to fetch referral tree")

        const result = await res.json()

        if (result.success && result.data) {
          const transformed = transformApiNode(result.data)
          setTreeData(transformed)
          setExpandedNodes(new Set([transformed.id]))
        } else throw new Error(result.message)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTreeData()
  }, [isOpen, loggedInUserId])

  const toggleNode = (id) =>
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-40" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col border"
          style={{ borderColor: ACCENT_YELLOW }}
        >
          {/* HEADER */}
          <div className="px-6 py-3 border-b flex items-center justify-between"
            style={{ backgroundColor: PRIMARY_NAVY, borderColor: ACCENT_YELLOW }}
          >
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-white" />
              <h2 className="text-lg font-semibold text-white">Binary Referral Network</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* ZOOM BUTTONS */}
          <div className="absolute top-24 right-6 z-50 flex flex-col gap-2">
            <button onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
              className="px-3 py-1 bg-gray-800 text-white rounded">+</button>
            <button onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))}
              className="px-3 py-1 bg-gray-800 text-white rounded">−</button>
            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }) }}
              className="px-3 py-1 bg-gray-800 text-white rounded text-xs">Reset</button>
          </div>

          {/* TREE AREA */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-auto px-10 py-8 bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100"
            style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
            onMouseDown={(e) => {
              isDragging.current = true
              dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
            }}
            onMouseMove={(e) => {
              if (!isDragging.current) return
              setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y })
            }}
            onMouseUp={() => (isDragging.current = false)}
            onMouseLeave={() => (isDragging.current = false)}
            onWheel={(e) => {
              e.preventDefault()
              setZoom((z) => Math.min(2, Math.max(0.3, z - e.deltaY * 0.001)))
            }}
          >
            {loading && (
              <div className="flex items-center justify-center h-full">
                <Loader className="w-8 h-8 animate-spin" />
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {!loading && treeData && (
              <div
                className="min-w-full flex justify-center"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: "transform 0.1s ease-out",
                }}
              >
                <TreeNode node={treeData} expanded={expandedNodes} onToggle={toggleNode} />
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="px-6 py-3 border-t bg-white text-xs flex gap-6"
            style={{ borderColor: ACCENT_YELLOW }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: GREEN_LOGGED_IN }} /> You
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: YELLOW_REFERRED }} /> Referral
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
