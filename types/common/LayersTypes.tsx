import { GeoJSON } from '@/types/common/GeojsonTypes'

export type ValueExtractor = (feature: GeoJSON.Feature) => number
export type LayerDataRecord = Record<string, GeoJSON.FeatureCollection>

export type LayerAttribute = {
  elevationRange: [number, number]
  elevationPropertyExtractor: ValueExtractor
  minElevation: number
  maxElevation: number
}
