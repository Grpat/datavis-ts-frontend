import React from 'react'
import { Slider } from '@mui/material'
import { CustomSlider } from '@/app/styles/muiStyled'

interface LayerSettingsProps {
  layerId: string
  onElevationRangeChange: (layerId: string, newElevationRange: number) => void
  onOpacityChange: (layerId: string, newOpacityValue: number) => void
  onColorScaleChange: (layerId: string, newOpacityValue: number) => void
}

const LayerSettings: React.FC<LayerSettingsProps> = ({ onElevationRangeChange, onOpacityChange, onColorScaleChange, layerId }) => {
  return (
    <div className='flex justify-center flex-col items-center'>
      <div className='mt-4 w-10/12'>
        <p className='text-xs'> Height</p>
        <CustomSlider
          size='small'
          aria-label='Elevation Height'
          defaultValue={10}
          valueLabelDisplay='auto'
          step={5}
          onChange={(event, newValue) => {
            onElevationRangeChange(layerId, newValue as number)
          }}
          min={10}
          max={150}
        ></CustomSlider>
      </div>
      <div className='mt-4 w-10/12'>
        <p className='text-xs'>Opacity</p>
        <CustomSlider
          size='small'
          aria-label='Opacity'
          defaultValue={0.5}
          valueLabelDisplay='auto'
          step={0.1}
          marks
          onChange={(event, newValue) => {
            onOpacityChange(layerId, newValue as number)
          }}
          min={0.0}
          max={1.0}
        ></CustomSlider>
      </div>
      <div className='mt-4 w-10/12'>
        <p className='text-xs'>Color Scale</p>
        <CustomSlider
          size='small'
          aria-label='Color Scale'
          defaultValue={50}
          valueLabelDisplay='auto'
          step={20}
          onChange={(event, newValue) => {
            onColorScaleChange(layerId, newValue as number)
          }}
          min={10}
          max={800}
        ></CustomSlider>
      </div>
    </div>
  )
}
export default LayerSettings
