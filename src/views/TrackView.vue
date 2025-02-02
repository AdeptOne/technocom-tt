<template>
  <div class="flex flex-col gap-2 py-4">
    <SchemaSelector v-if="data.schemas" :schemaList="data.schemas" />
    <Splitter class="h-96">
      <SplitterPanel>
        <ScrollPanel class="w-full h-full p-2 text-center">
          <h3 class="mb-2">Приборы</h3>
          <ul v-if="data.device.tree" class="list-none">
            <TreeNode
              v-for="node of data.device.tree"
              option-label="name"
              :key="`device-${node.id}`"
              :node="node"
              :selection-state="data.device.selected"
              @update-selection="updateSelectedDevices"
            />
          </ul>
        </ScrollPanel>
      </SplitterPanel>
      <SplitterPanel>
        <ScrollPanel class="w-full h-full p-2 text-center">
          <h3 class="mb-2">Геозоны</h3>
          <ul v-if="data.geofence.tree" class="list-none">
            <TreeNode
              v-for="node of data.geofence.tree"
              option-label="name"
              :key="`geofence-${node.id}`"
              :node="node"
              :selection-state="data.geofence.selected"
              @update-selection="updateSelectedGeofences"
            />
          </ul>
        </ScrollPanel>
      </SplitterPanel>
    </Splitter>
    <Map :tracks="tracks" :geofences="geofences" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watchEffect, watch, onMounted } from 'vue'

import { debounce } from 'lodash'
import {
  getEnumGeoFences,
  getEnumDevices,
  getTrack,
  getEnumSchemas,
  getGeofences,
} from '@/shared/services/jsonService'
import { useSession } from '@/store/session'
import type { Schema } from '@/shared/services/jsonService/types'
import { buildTree } from '@/utils/tree'

interface Data {
  geofence: {
    tree: any[]
    selected: string[]
  }
  device: {
    tree: any[]
    selected: string[]
  }
  schemas: Schema[]
}

const session = useSession()

const initialValue = {
  geofence: {
    tree: [],
    selected: [],
  },
  device: {
    tree: [],
    selected: [],
  },
  schemas: [],
}

const data = reactive<Data>(initialValue)

const debounceTime = 300 // Время в мс
const tracks = ref()
const geofences = ref()

const updateSelectedDevices = (node: any, parentId: string | null = null) => {
  if (parentId === null) {
    if (data.device.selected.includes(node.id)) {
      data.device.selected = data.device.selected.filter((key) => key !== node.id)
    } else {
      data.device.selected.push(node.id)
    }

    return
  }

  if (data.device.selected.includes(parentId)) {
    if (!data.device.selected.includes(node.id)) {
      data.device.selected.push(node.id)

      if (node?.children && node?.children.length) {
        node.children.forEach((child: any) => {
          updateSelectedDevices(child, parentId)
        })
      }
    }

    return
  }

  if (data.device.selected.includes(node.id)) {
    data.device.selected = data.device.selected.filter((key) => key !== node.id)
    if (node?.children && node?.children.length) {
      node.children.forEach((child: any) => {
        updateSelectedDevices(child, parentId)
      })
    }
  }
}

const updateSelectedGeofences = (node: any, parentId: string | null = null) => {
  if (parentId === null) {
    if (data.geofence.selected.includes(node.id)) {
      data.geofence.selected = data.device.selected.filter((key) => key !== node.id)
    } else {
      data.geofence.selected.push(node.id)
    }

    return
  }

  if (data.geofence.selected.includes(parentId)) {
    if (!data.geofence.selected.includes(node.id)) {
      data.geofence.selected.push(node.id)

      if (node?.children && node?.children.length) {
        node.children.forEach((child: any) => {
          updateSelectedDevices(child, parentId)
        })
      }
    }

    return
  }

  if (data.geofence.selected.includes(node.id)) {
    data.geofence.selected = data.geofence.selected.filter((key) => key !== node.id)
    if (node?.children && node?.children.length) {
      node.children.forEach((child: any) => {
        updateSelectedDevices(child, parentId)
      })
    }
  }
}

watch(
  () => [...data.device.selected],
  debounce(async () => {
    tracks.value = await getTrack(data.device.selected)
  }, debounceTime),
)

watch(
  () => [...data.geofence.selected],
  debounce(async () => {
    if (data.geofence.selected.length) {
      geofences.value = await getGeofences(data.geofence.selected)
      return
    }
    geofences.value = undefined
  }, debounceTime),
)

watchEffect(async () => {
  if (session.schemaId) {
    const geoResp = await getEnumGeoFences(session.schemaId)
    data.geofence.tree = buildTree(geoResp.groups, geoResp.items)

    const dResp = await getEnumDevices(session.schemaId)
    data.device.tree = buildTree(dResp.groups, dResp.items)
  }
})

onMounted(
  debounce(async () => {
    data.schemas = await getEnumSchemas()
  }, debounceTime),
)
</script>
