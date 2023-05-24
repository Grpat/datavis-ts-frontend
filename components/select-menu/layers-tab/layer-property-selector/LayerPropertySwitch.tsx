import React, { useState } from 'react'
import LayerPropertySelector from '@/components/select-menu/layers-tab/layer-property-selector/LayerPropertySelector'
import { CustomSwitch } from '@/app/styles/muiStyled'
import { LayerDataRecord } from '@/types/common/LayersTypes'
import { Option } from '@/types/common/Option'

interface LayerPropertySwitchProps {
  label: string
  layerId: string
  layersData: LayerDataRecord
  selectedOption: Option | null
  setSelectedOption: (option: Option | null) => void
  onPropertyChange: (option: Option | null, layerId: string) => void
  includeString: boolean
}

const LayerPropertySwitch: React.FC<LayerPropertySwitchProps> = ({
  label,
  layerId,
  layersData,
  selectedOption,
  setSelectedOption,
  onPropertyChange,
  includeString,
}) => {
  const [showSelect, setShowSelect] = useState(false)

  const handleSwitchChange = () => {
    setShowSelect(!showSelect)
  }
  return (
    <div className='flex flex-col pb-4'>
      <div className='flex justify-end items-center pb-2'>
        <p className='text-xs'>custom property</p>
        <CustomSwitch onChange={handleSwitchChange} size='small' />
      </div>
      {showSelect && (
        <LayerPropertySelector
          layerId={layerId}
          layersData={layersData}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          onPropertyChange={onPropertyChange}
          includeString={includeString}
        />
      )}
    </div>
  )
}
export default LayerPropertySwitch
