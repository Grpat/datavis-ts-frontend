import React from 'react'
import { GeoJsonLayer } from '@deck.gl/layers/typed'
import FilterComponent from '@/components/select-menu/layers-filters/FilterComponent'

interface FiltersTabComponentProps {
  layers: GeoJsonLayer[]
}

const FiltersTab: React.FC<FiltersTabComponentProps> = ({ layers }) => {
  return (
    <div className='mt-8'>
      {layers.map((layer, index) => (
        <FilterComponent key={index} layer={layer} />
      ))}
    </div>
  )
}
export default FiltersTab
