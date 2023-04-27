import React from 'react'
import { GeoJsonLayer } from '@deck.gl/layers/typed'
import FilterComponent from '@/components/select-menu/layers-filters/FilterComponent'
import { LayerAttribute, LayerDataRecord } from '@/types/common/LayersTypes'

interface FiltersTabComponentProps {
  layers: GeoJsonLayer[]
  layersData: LayerDataRecord
  onPropertySelected: (property: string | null, layerId: string, min: number, max: number, filterIndex: number) => void
  onSliderChange: (layerId: string, selectedProperty: string | null, newValue: number[] | number) => void

  //onFiltersChange: (layerId: string, newFilters: Array<{ property: string | null; min: number; max: number; filterIndex: number }>) => void
  filters: Record<string, Array<{ property: string | null; min: number; max: number; filterIndex: number }>>
  setFilters: (newFilters: Record<string, Array<{ property: string | null; min: number; max: number; filterIndex: number }>>) => void
  layerAttributes: Record<string, LayerAttribute>
}

const FiltersTab: React.FC<FiltersTabComponentProps> = ({
  layers,
  layersData,
  onPropertySelected,
  onSliderChange,
  //onFiltersChange,
  filters,
  setFilters,
  layerAttributes,
}) => {
  return (
    <div className='mt-8'>
      {layers.map((layer, index) => (
        <FilterComponent
          onPropertySelected={onPropertySelected}
          layersData={layersData}
          key={index}
          layer={layer}
          onSliderChange={onSliderChange}
          //onFiltersChange={onFiltersChange}
          filters={filters}
          setFilters={setFilters}
          layerAttributes={layerAttributes}
        />
      ))}
    </div>
  )
}
export default FiltersTab
