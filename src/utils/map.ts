import { Feature } from 'ol'
import type { Color } from 'ol/color'
import type { ColorLike } from 'ol/colorlike'
import type { FeatureLike } from 'ol/Feature'
import { Circle, LineString, Polygon } from 'ol/geom'

import { Fill, Stroke, Style } from 'ol/style'

export function createCircleFeature({
  lat,
  lng,
  radius,
  fillColor,
  lineColor,
  lineWidth,
}: {
  lat: number
  lng: number
  radius: number
  fillColor: string | number
  lineColor: string | number
  lineWidth: number
}) {
  return new Feature({
    geometry: new Circle([lng, lat], radius / 10000), // Есть вопросы по радиусу
    style: new Style({
      fill: new Fill({ color: fillColor as Color | ColorLike }),
      stroke: new Stroke({ color: lineColor as Color | ColorLike, width: lineWidth }),
    }),
  })
}

export function createPolygon(data: any) {
  const coordinates = data.lat.map((lat: number, index: number) => [data.lng[index], lat])
  coordinates.push(coordinates[0])

  return new Feature({ geometry: new Polygon([coordinates]) })
}

export function createTrackLine(data: any[]) {
  const track: { lng: number[]; lat: number[] } & Record<string, any> = data[0]

  if (!track) {
    return []
  }

  const coordinates = track.lng.map((lng, index) => [lng, track.lat[index]])

  const segments: Feature[] = []

  for (let i = 0; i < coordinates.length - 1; i++) {
    const segmentCoordinates = [coordinates[i], coordinates[i + 1]]
    const segment = new LineString(segmentCoordinates)
    const currentSpeed = track.speed[i] // Скорость для текущего сегмента
    segments.push(
      new Feature({ geometry: segment, speed: currentSpeed, colorSettings: track.colorSettings }),
    )
  }

  return segments
}

function getColorForSpeed(speed: number, colorSettings: any) {
  const {
    parameter: { colors },
    defaultColor,
  } = colorSettings

  // Интерполируем цвет между точками
  for (let i = 0; i < colors.length - 1; i++) {
    const current = colors[i]
    const next = colors[i + 1]

    if (speed >= current.value && speed <= next.value) {
      const t = (speed - current.value) / (next.value - current.value)

      const color = interpolateColor(current.color, next.color, t)

      return color ? color : defaultColor
    }
  }

  // Если скорость вне диапазона, возвращаем последний цвет
  return colors[colors.length - 1].color
}

function interpolateColor(color1: string, color2: string, factor: number): string | null {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (rgb1 && rgb2) {
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor)
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor)
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor)

    return `rgb(${r}, ${g}, ${b})`
  }

  return null
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export function trackStyle(feature: FeatureLike): Style {
  const speed = feature.get('speed')
  const colorSettings = feature.get('colorSettings')

  const color = getColorForSpeed(speed, colorSettings)

  return new Style({
    stroke: new Stroke({
      color,
      width: 6,
    }),
  })
}

export const polygonStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 0, 0, 0)',
  }),
  stroke: new Stroke({
    color: 'rgba(255, 165, 0, 1)',
    width: 10,
  }),
})
