<template>
  <li :style="{ paddingLeft: `${level}rem` }">
    <div class="flex gap-2 items-center">
      <input
        type="checkbox"
        :checked="isSelected(node)"
        :indeterminate="isIndeterminate(node)"
        @click="toggleNode(node)"
        :id="node.id"
      />

      <label class="w-full text-start" :for="node.id">{{ node.name }}</label>
    </div>

    <ul v-if="node?.children && node?.children.length">
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :level="level + 1"
        :node="child"
        :selection-state="selectionState"
        @update-selection="toggleChildren"
      />
    </ul>
  </li>
</template>

<script setup lang="ts" generic="T extends Node & Record<string, any>">
import type { Node } from '@/utils/tree'

interface Props {
  node: T
  level?: number
  selectionState: string[]
}

const props = withDefaults(defineProps<Props>(), {
  level: 0,
})

function isSelected(node: any): boolean {
  if (node.children) {
    return node.children.every((child: any) => isSelected(child))
  }

  return props.selectionState.includes(node.id)
}

function isIndeterminate(node: any): boolean {
  if (node.children) {
    const isAllChildSelected = node.children.every((child: any) => isSelected(child))

    if (isAllChildSelected) {
      return false
    }

    return node.children.some((child: any) => isSelected(child) || isIndeterminate(child))
  }

  return false
}

const emit = defineEmits(['update-selection'])

function updateChildren(node: any) {
  if (node?.children && node.children.length) {
    node.children.forEach((child: any) => {
      emit('update-selection', child, node.id)
      updateChildren(child)
    })
  }
}

function toggleChildren(node: any, parentId: string | null) {
  emit('update-selection', node, parentId)
}

function toggleNode(node: any, parentId: string | null = null): void {
  if (!node) return
  emit('update-selection', node, parentId)

  updateChildren(node)
}
</script>
