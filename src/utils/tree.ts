export interface Node<T = any, I = any> {
  id: T
  parentId?: I
  children?: any
}

export function buildTree(groups: any[], items: any[]): any[] {
  const idToNodeMap: Record<string, any> = {} // Map for groups
  const rootNodes: any[] = [] // Array for root-level groups

  // Step 1: Create a map of all groups for quick access
  groups.forEach((group) => {
    idToNodeMap[group.id] = { ...group, children: [] }
  })

  // Step 2: Assign children (both groups and items) to their parent groups
  ;[...groups, ...items].forEach((node) => {
    const parentNodeId = node.parentId

    if (parentNodeId === null) {
      // If no parent, it's a root node
      rootNodes.push(idToNodeMap[node.id] || node)
    } else {
      // Otherwise, find the parent and add the node as a child
      const parentNode = idToNodeMap[parentNodeId]
      if (parentNode) {
        ;(parentNode.children || []).push(idToNodeMap[node.id] || node)
      }
    }
  })

  return rootNodes // Return the root-level nodes
}
