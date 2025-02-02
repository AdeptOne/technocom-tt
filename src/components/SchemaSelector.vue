<template>
  <Select
    :options="schemaList"
    option-label="name"
    option-value="id"
    v-model="session.schemaId"
    @change="onSchemaChange"
    placeholder="Выберите схему"
    fluid
  />
</template>

<script setup lang="ts">
import { useSession } from '@/store/session'
import type { SelectChangeEvent } from 'primevue'

defineProps<{ schemaList: any[] }>()

const session = useSession()

const onSchemaChange = (e: SelectChangeEvent) => {
  session.schemaId = e.value
}
</script>
