import React from 'react'
import { GeoJsonLayer } from '@deck.gl/layers/typed'
import FilterComponent from '@/components/select-menu/layers-filters/FilterComponent'
import { LayerAttribute, LayerDataRecord } from '@/types/common/LayersTypes'

interface FiltersTabComponentProps {
  layers: GeoJsonLayer[]
  layersData: LayerDataRecord
  onPropertySelected: (property: string | null, layerId: string, min: number, max: number, filterIndex: number) => void
  onSliderChange: (layerId: string, selectedProperty: string | null, newValue: number[] | number) => void

  filters: Record<string, Array<{ property: string | null; min: number; max: number; filterIndex: number }>>
  setFilters: (newFilters: Record<string, Array<{ property: string | null; min: number; max: number; filterIndex: number }>>) => void
  layerAttributes: Record<string, LayerAttribute>
  onFilterConditionDelete: (layerId: string, filterIndex: number) => void
  onClearAllFilters: (layerId: string) => void
}

const FiltersTab: React.FC<FiltersTabComponentProps> = ({
  layers,
  layersData,
  onPropertySelected,
  onSliderChange,

  filters,
  setFilters,
  layerAttributes,
  onFilterConditionDelete,
  onClearAllFilters,
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
          filters={filters}
          setFilters={setFilters}
          layerAttributes={layerAttributes}
          onFilterConditionDelete={onFilterConditionDelete}
          onClearAllFilters={onClearAllFilters}
        />
      ))}
    </div>
  )
}
export default FiltersTab
