import React from 'react'
import { CustomSlider } from '@/app/styles/muiStyled'
import LayerPropertySwitch from '@/components/select-menu/layers-tab/layer-property-selector/LayerPropertySwitch'
import { LayerDataRecord } from '@/types/common/LayersTypes'
import { Option } from '@/types/common/Option'

interface LayerSettingsProps {
  layerId: string
  onElevationRangeChange: (layerId: string, newElevationRange: number) => void
  onOpacityChange: (layerId: string, newOpacityValue: number) => void
  onColorScaleChange: (layerId: string, newOpacityValue: number) => void

  layersData: LayerDataRecord
  selectedElevationProp: Option | null
  setSelectedElevationProp: (option: Option | null) => void
  onPropertyElevationChange: (option: Option | null, layerId: string) => void
  selectedColorProp: Option | null
  setSelectedColorProp: (option: Option | null) => void

  onPropertyColorChange: (option: Option | null, layerId: string) => void
}

const LayerSettings: React.FC<LayerSettingsProps> = ({
  onElevationRangeChange,
  onOpacityChange,
  onColorScaleChange,
  layerId,
  layersData,
  selectedElevationProp,
  setSelectedElevationProp,
  onPropertyElevationChange,
  selectedColorProp,
  setSelectedColorProp,
  onPropertyColorChange,
}) => {
  return (
    <div className='flex justify-center flex-col items-center'>
      <div className='mt-4 w-10/12'>
        <p className='text-xs'> Height</p>
        <LayerPropertySwitch
          layerId={layerId}
          layersData={layersData}
          label='custom property'
          selectedOption={selectedElevationProp}
          setSelectedOption={setSelectedElevationProp}
          onPropertyChange={onPropertyElevationChange}
          includeString={false}
        ></LayerPropertySwitch>
        <CustomSlider
          size='small'
          aria-label='Elevation Height'
          defaultValue={10}
          valueLabelDisplay='auto'
          step={0.2}
          onChange={(event, newValue) => {
            onElevationRangeChange(layerId, newValue as number)
          }}
          min={0.1}
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
        <LayerPropertySwitch
          layerId={layerId}
          layersData={layersData}
          label='custom property'
          selectedOption={selectedColorProp}
          setSelectedOption={setSelectedColorProp}
          onPropertyChange={onPropertyColorChange}
          includeString={true}
        ></LayerPropertySwitch>
        <CustomSlider
          size='small'
          aria-label='Color Scale'
          defaultValue={50}
          valueLabelDisplay='auto'
          step={0.6}
          onChange={(event, newValue) => {
            onColorScaleChange(layerId, newValue as number)
          }}
          min={0.1}
          max={800}
        ></CustomSlider>
      </div>
    </div>
  )
}
export default LayerSettings
