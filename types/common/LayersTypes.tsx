import { GeoJSON } from '@/types/common/GeojsonTypes'

export type ValueExtractor = (feature: GeoJSON.Feature) => number | string
export type LayerDataRecord = Record<string, GeoJSON.FeatureCollection>
export type FilterCondition = {
  selectedProperty: string
  index: number
  minValue: number
  maxValue: number
  sliderValue: [number, number]
}

export type LayerAttribute = {
  elevationRange: [number, number]
  colorRange: [number, number]
  elevationPropertyExtractor: ValueExtractor
  colorPropertyExtractor: ValueExtractor
  filterConditions: FilterCondition[]
  minElevation: number
  maxElevation: number
  visible: boolean
  opacity: number
  colorScale: number
}
