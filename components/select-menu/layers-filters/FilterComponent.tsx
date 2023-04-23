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
import LayerSettings from '@/components/select-menu/layers-tab/LayerSettings'
import FilterOptions from '@/components/select-menu/layers-filters/FilterOptions'

interface FilterComponentProps {
  layer: GeoJsonLayer
}

const FilterComponent: React.FC<FilterComponentProps> = ({ layer }) => {
  const layerInfo = layer.id.split('|').slice(0, -1)

  const [openFilterOptions, setOpenFilterOptions] = useState<boolean>(false)
  const [isSelectedLayer, setIsSelectedLayer] = useState<boolean>(false)

  const handleOpenFilterOptions = () => {
    setIsSelectedLayer(prevState => !prevState)
    setOpenFilterOptions(!openFilterOptions)
  }
  return (
    <div>
      <div
        className={`flex mt-2 h-12 w-[230px] bg-zinc-800 rounded-sm hover:bg-zinc-700 transition-colors duration-300 justify-center cursor-pointer ${
          isSelectedLayer === true ? 'ml-2 border-l-4 border-indigo-600' : 'border-l-2 border-cyan-400'
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
          <Tooltip title='Add Filter' arrow>
            <CustomAddIcon className='mr-1'></CustomAddIcon>
          </Tooltip>
          <Tooltip title='Layer settings' arrow>
            <CustomDropDown onClick={handleOpenFilterOptions} className='mr-1 ml-1'></CustomDropDown>
          </Tooltip>
        </div>
      </div>
      {openFilterOptions && <FilterOptions layerId={layer.id}></FilterOptions>}
    </div>
  )
}
export default FilterComponent
