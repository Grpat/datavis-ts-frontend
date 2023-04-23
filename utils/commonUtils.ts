import { GeoJSON } from '@/types/common/GeojsonTypes'
import { v4 as uuid } from 'uuid'
import { ValueExtractor } from '@/types/common/LayersTypes'
import { scaleThreshold } from 'd3-scale'

export function timestampToYear(timestamp: number): number {
  const date = new Date(timestamp)
  return date.getFullYear()
}

export function generateLayerId(data: GeoJSON.FeatureCollection): string {
  const uniqueID = uuid()
  if (data && data.features && data.features.length > 0) {
    const type = data.features[0].geometry?.type?.toString() ?? ''
    const indicatorId = data.features[0].properties?.indicatorId ?? ''
    return `${type}|${indicatorId}|${uniqueID}`
  }
  return `layer|${uniqueID}`
}

export const getMinMaxValues = (data: GeoJSON.FeatureCollection, valueExtractor: ValueExtractor): [number, number] => {
  let minValue = Number.MAX_VALUE
  let maxValue = Number.MIN_VALUE

  data.features.forEach((feature: GeoJSON.Feature) => {
    const value = valueExtractor(feature)
    if (value !== undefined && value !== null) {
      minValue = Math.min(minValue, value)
      maxValue = Math.max(maxValue, value)
    }
  })

  return [minValue, maxValue]
}
export const normalizeValue = (value: number, minValue: number, maxValue: number, newMin: number, newMax: number): number => {
  return ((value - minValue) * (newMax - newMin)) / (maxValue - minValue) + newMin
}

export const createColorScale = (minValue: number, maxValue: number, numSegments: number) => {
  const domain = Array.from({ length: numSegments }, (_, i) => minValue + ((maxValue - minValue) * i) / (numSegments - 1))

  return (
    scaleThreshold()
      .domain(domain)
      // @ts-ignore
      .range([
        [65, 182, 196],
        [127, 205, 187],
        [199, 233, 180],
        [237, 248, 177],
        // zero
        [255, 255, 204],
        [255, 237, 160],
        [254, 217, 118],
        [254, 178, 76],
        [253, 141, 60],
        [252, 78, 42],
        [227, 26, 28],
        [189, 0, 38],
        [128, 0, 38],
      ])
  )
}
