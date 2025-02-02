<template>
  <div class="w-full overflow-hidden rounded" id="ol-map" style="height: 600px" />
</template>

<script setup lang="ts">
import { onMounted, reactive, watchEffect } from 'vue'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import type { TrackDto, ZoneDto } from '@/shared/services/jsonService/types'
import {
  createCircleFeature,
  createPolygon,
  createTrackLine,
  polygonStyle,
  trackStyle,
} from '@/utils/map'

const props = defineProps<{ tracks?: TrackDto; geofences?: ZoneDto }>()
const map = reactive<{
  instance?: Map
  layers: Record<string, VectorLayer>
}>({
  instance: undefined,
  layers: {
    devices: new VectorLayer({
      source: new VectorSource(),
      style: trackStyle,
    }),
    geofences: new VectorLayer({
      source: new VectorSource(),
    }),
    polygons: new VectorLayer({
      source: new VectorSource(),
      style: polygonStyle,
    }),
  },
})

watchEffect(() => {
  const deviceSource = map.layers['devices'].get('source')
  deviceSource.clear(true)

  if (!!props.tracks) {
    Object.values(props.tracks)
      .map(createTrackLine)
      .forEach((features) => deviceSource.addFeatures(features))
  }
})

watchEffect(() => {
  const zoneSource = map.layers['geofences'].get('source')
  const polygonSource = map.layers['polygons'].get('source')

  zoneSource.clear(true)
  polygonSource.clear(true)

  if (!!props.geofences) {
    Object.values(props.geofences).forEach((zone) => {
      if (zone.isPolygon) {
        console.log('Рисуем полигон')
        polygonSource.addFeature(createPolygon(zone))
      } else {
        zoneSource.addFeature(
          createCircleFeature({
            lat: zone.lat[0],
            lng: zone.lng[0],
            radius: zone.r,
            fillColor: zone.fill,
            lineColor: zone.line,
            lineWidth: zone.lineWidth,
          }),
        )
      }
    })
  }
})

onMounted(() => {
  map.instance = new Map({
    target: 'ol-map',
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      ...Object.values(map.layers),
    ],
    view: new View({
      projection: 'EPSG:4326',
      center: [61.42426, 55.16892],
      zoom: 10,
    }),
  })
})
</script>

<style scoped></style>
