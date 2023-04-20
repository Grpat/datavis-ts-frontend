import { GeoJSON } from '@/types/common/GeojsonTypes'
import { v4 as uuid } from 'uuid'
import { ValueExtractor } from '@/types/common/LayersTypes'
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
