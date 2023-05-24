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
import { LayerDataRecord } from '@/types/common/LayersTypes'
import { Option } from '@/types/common/Option'

interface LayerComponentProps {
  layer: GeoJsonLayer

  onDeleteLayer(layerId: string): void

  onToggleVisibilityLayer(layerId: string): void

  onElevationRangeChange: (layerId: string, newElevationRange: number) => void
  onOpacityChange: (layerId: string, newOpacityValue: number) => void
  onColorScaleChange: (layerId: string, newOpacityValue: number) => void

  onCopyLayer(layerId: string): void

  visibility: boolean
  layersData: LayerDataRecord
  selectedElevationProp: Option | null
  setSelectedElevationProp: (option: Option | null) => void
  onPropertyElevationChange: (option: Option | null, layerId: string) => void
  selectedColorProp: Option | null
  setSelectedColorProp: (option: Option | null) => void

  onPropertyColorChange: (option: Option | null, layerId: string) => void
}

const LayerComponent: React.FC<LayerComponentProps> = ({
  layer,
  onDeleteLayer,
  onToggleVisibilityLayer,
  onCopyLayer,
  onElevationRangeChange,
  onOpacityChange,
  onColorScaleChange,
  visibility,
  layersData,
  selectedElevationProp,
  setSelectedElevationProp,
  onPropertyElevationChange,
  selectedColorProp,
  setSelectedColorProp,
  onPropertyColorChange,
}) => {
  const layerInfo = layer.id.split('|').slice(0, -1)
  const [isVisible, setIsVisible] = useState<boolean>(visibility)
  const [openSettings, setOpenSettings] = useState<boolean>(false)
  const [isSelectedLayer, setIsSelectedLayer] = useState<boolean>(false)
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
  const handleOpenSettings = () => {
    setIsSelectedLayer(prevState => !prevState)
    setOpenSettings(!openSettings)
  }
  return (
    <div>
      <div
        className={`flex mt-2 h-12 w-[250px] bg-zinc-800 rounded-sm hover:bg-zinc-700 transition-colors duration-300 justify-center cursor-pointer ${
          isSelectedLayer ? 'ml-2 border-l-2 border-indigo-600' : 'border-l-2 border-cyan-400'
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
            <CustomDropDown onClick={handleOpenSettings} className='mr-1 ml-1'></CustomDropDown>
          </Tooltip>
        </div>
      </div>
      {openSettings && (
        <LayerSettings
          onElevationRangeChange={onElevationRangeChange}
          onOpacityChange={onOpacityChange}
          onColorScaleChange={onColorScaleChange}
          layerId={layer.id}
          layersData={layersData}
          selectedElevationProp={selectedElevationProp}
          setSelectedElevationProp={setSelectedElevationProp}
          onPropertyElevationChange={onPropertyElevationChange}
          selectedColorProp={selectedColorProp}
          setSelectedColorProp={setSelectedColorProp}
          onPropertyColorChange={onPropertyColorChange}
        ></LayerSettings>
      )}
    </div>
  )
}
export default LayerComponent
