import React, { useMemo } from 'react'
import { getPropertyKeys } from '@/utils/commonUtils'
import { Option } from '@/types/common/Option'
import { LayerDataRecord } from '@/types/common/LayersTypes'
import SelectOption from '@/components/select-menu/SelectOption'

interface LayerPropertySelectorProps {
  layerId: string
  layersData: LayerDataRecord
  selectedOption: Option | null
  setSelectedOption: (option: Option | null) => void
  onPropertyChange: (option: Option | null, layerId: string) => void
  includeString: boolean
}

const LayerPropertySelector: React.FC<LayerPropertySelectorProps> = ({
  layerId,
  layersData,
  selectedOption,
  setSelectedOption,
  onPropertyChange,
  includeString,
}) => {
  const propertyKeys = useMemo(() => getPropertyKeys(layerId, layersData, includeString), [layerId])

  const selectOptions: Option[] = propertyKeys.map((key, index) => ({
    id: index.toString(),
    value: key,
  }))
  const handleInputChange = (option: Option | null) => {
    if (!option) return
    setSelectedOption(option)
    onPropertyChange(option, layerId)
  }
  return (
    <div>
      <SelectOption isMultiple={false} selectOptions={selectOptions} selectedOption={selectedOption} onOptionChange={handleInputChange} />
    </div>
  )
}
export default LayerPropertySelector
