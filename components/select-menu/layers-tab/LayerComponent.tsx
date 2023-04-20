import React, { useState } from 'react'
import { GeoJsonLayer } from '@deck.gl/layers/typed'
import {
  CustomContentCopyIcon,
  CustomDeleteIcon,
  CustomVisibilityIcon,
  CustomVisibilityOffIcon,
  CustomDropDown,
} from '@/app/styles/muiStyled'
import { Tooltip } from '@mui/material'
import LayerSettings from '@/components/select-menu/layers-tab/LayerSettings'

interface LayerComponentProps {
  layer: GeoJsonLayer

  onDeleteLayer(layerId: string): void

  onToggleVisibilityLayer(layerId: string): void

  onCopyLayer(layerId: string): void
}

const LayerComponent: React.FC<LayerComponentProps> = ({ layer, onDeleteLayer, onToggleVisibilityLayer, onCopyLayer }) => {
  const layerInfo = layer.id.split('|').slice(0, -1)
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [openSettings, setOpenSettings] = useState<boolean>(false)
  const handleDeleteClick = () => {
    onDeleteLayer(layer.id)
  }
  const handleVisibilityClick = () => {
    onToggleVisibilityLayer(layer.id)
    setIsVisible(!isVisible)
  }

  const handleCopyClick = () => {
    onCopyLayer(layer.id)
  }
  return (
    <div className='flex mt-2 h-12 w-[250px] bg-zinc-800 rounded-sm hover:bg-zinc-700 transition-colors duration-300 justify-center  cursor-pointer border-l-2 border-cyan-400'>
      <div className='flex flex-col space-y-1  w-[200px] justify-center'>
        {layerInfo.map((info, index) => (
          <p key={index} className='ml-4 text-xs text-zinc-300 font-thin mr-2'>
            {info}
          </p>
        ))}
      </div>
      <div className='layer-icons flex items-center '>
        <Tooltip title='Remove Layer' arrow>
          <CustomDeleteIcon onClick={handleDeleteClick} className='mr-1'></CustomDeleteIcon>
        </Tooltip>
        <Tooltip title='Duplicate layer' arrow>
          <CustomContentCopyIcon onClick={handleCopyClick} className='mr-1'></CustomContentCopyIcon>
        </Tooltip>
        {isVisible ? (
          <Tooltip title='Hide layer' arrow>
            <CustomVisibilityIcon onClick={handleVisibilityClick} className='mr-1'></CustomVisibilityIcon>
          </Tooltip>
        ) : (
          <Tooltip title='Show layer' arrow>
            <CustomVisibilityOffIcon onClick={handleVisibilityClick} className='mr-1'></CustomVisibilityOffIcon>
          </Tooltip>
        )}
        <Tooltip title='Layer settings' arrow>
          <CustomDropDown onClick={() => setOpenSettings(!openSettings)} className='mr-1 ml-1'></CustomDropDown>
        </Tooltip>
        {openSettings && <LayerSettings></LayerSettings>}
      </div>
    </div>
  )
}
export default LayerComponent
