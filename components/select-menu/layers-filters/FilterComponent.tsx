import React, { useState } from 'react'
import { GeoJsonLayer } from '@deck.gl/layers/typed'
import {
  CustomContentCopyIcon,
  CustomDeleteIcon,
  CustomVisibilityIcon,
  CustomVisibilityOffIcon,
  CustomDropDown,
  CustomAddIcon,
} from '@/app/styles/muiStyled'
import { Tooltip } from '@mui/material'
import FilterOptions from '@/components/select-menu/layers-filters/FilterOptions'
import { LayerAttribute, LayerDataRecord } from '@/types/common/LayersTypes'

interface FilterComponentProps {
  layer: GeoJsonLayer
  layersData: LayerDataRecord
  onPropertySelected: (property: string | null, layerId: string, min: number, max: number, filterIndex: number) => void
  onSliderChange: (layerId: string, selectedProperty: string | null, newValue: number[] | number) => void
  filters: Record<string, Array<{ property: string | null; min: number; max: number; filterIndex: number }>>
  //onFiltersChange: (layerId: string, newFilters: Array<{ property: string | null; min: number; max: number; filterIndex: number }>) => void
  setFilters: (newFilters: Record<string, Array<{ property: string | null; min: number; max: number; filterIndex: number }>>) => void
  layerAttributes: Record<string, LayerAttribute>
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  layersData,
  layer,
  onPropertySelected,
  onSliderChange,
  //onFiltersChange,
  filters,
  setFilters,
  layerAttributes,
}) => {
  const layerInfo = layer.id.split('|').slice(0, -1)

  const [openFilterOptions, setOpenFilterOptions] = useState<boolean>(false)
  const [isSelectedLayer, setIsSelectedLayer] = useState<boolean>(false)

  const handleOpenFilterOptions = () => {
    setIsSelectedLayer(prevState => !prevState)
    setOpenFilterOptions(!openFilterOptions)
  }
  return (
    <div className='flex flex-col items-center'>
      <div
        className={`flex mt-2 h-12 w-[250px] bg-zinc-800 rounded-sm hover:bg-zinc-700 transition-colors duration-300 justify-center cursor-pointer rounded-sm ${
          isSelectedLayer === true ? 'border-l-2 border-indigo-600' : 'border-l-2 border-cyan-400'
        }`}
      >
        <div className='flex flex-col space-y-1  w-[200px] justify-center'>
          {layerInfo.map((info, index) => (
            <p key={index} className='ml-4 text-xs text-zinc-400 font-thin mr-2'>
              {info}
            </p>
          ))}
        </div>
        <div className='layer-icons flex items-center '>
          <Tooltip title='Layer Filters' arrow>
            <CustomDropDown onClick={handleOpenFilterOptions} className='mr-1 ml-1'></CustomDropDown>
          </Tooltip>
        </div>
      </div>
      {openFilterOptions && (
        <FilterOptions
          onPropertySelected={onPropertySelected}
          layersData={layersData}
          layerId={layer.id}
          onSliderChange={onSliderChange}
          onFiltersChange={newFilters => {
            setFilters({ ...filters, [layer.id]: newFilters })
          }}
          filters={filters[layer.id] || []}
          layerAttributes={layerAttributes}
        ></FilterOptions>
      )}
    </div>
  )
}
export default FilterComponent
