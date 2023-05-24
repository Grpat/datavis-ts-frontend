import React, { useMemo, useState } from 'react'
import { LayerAttribute, LayerDataRecord } from '@/types/common/LayersTypes'
import { Option } from '@/types/common/Option'
import SelectOption from '@/components/select-menu/SelectOption'
import { Button, Tooltip } from '@mui/material'
import { CustomDeleteIcon, CustomSlider } from '@/app/styles/muiStyled'
import { getPropertyKeys } from '@/utils/commonUtils'

interface FilterOptionsProps {
  layerId: string
  layersData: LayerDataRecord
  onPropertySelected: (property: string | null, layerId: string, min: number, max: number, filterIndex: number) => void
  onSliderChange: (layerId: string, selectedProperty: string | null, newValue: number[] | number) => void
  filters: Array<{ property: string | null; min: number; max: number; filterIndex: number }>
  onFiltersChange: (newFilters: Array<{ property: string | null; min: number; max: number; filterIndex: number }>) => void
  layerAttributes: Record<string, LayerAttribute>
  onFilterConditionDelete: (layerId: string, filterIndex: number) => void
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  layersData,
  layerId,
  onPropertySelected,
  onSliderChange,
  filters,
  onFiltersChange,
  layerAttributes,
  onFilterConditionDelete,
}) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  const addNewFilter = (property: string | null, min: number, max: number, filterIndex: number) => {
    onFiltersChange([...filters, { property, min, max, filterIndex }])
  }

  const propertyKeys = useMemo(() => getPropertyKeys(layerId, layersData), [layerId])

  const selectOptions: Option[] = propertyKeys.map((key, index) => ({
    id: index.toString(),
    value: key,
  }))
  const handleInputChange = (option: Option | null) => {
    if (!option) return
    setSelectedOption(option)
  }

  const handleCreateSlider = () => {
    if (!selectedOption) return
    const existingFilter = filters.find(filter => filter.property === selectedOption.value)
    if (existingFilter) return

    const [minValue, maxValue] = getMinMaxPropertyValues(layerId, selectedOption.value)
    const filterIndex = filters?.length || 0
    onPropertySelected(selectedOption.value || null, layerId, minValue, maxValue, filterIndex)
    addNewFilter(selectedOption.value, minValue, maxValue, filterIndex)
  }
  const getSliderValues = (
    layerAttributes: Record<string, LayerAttribute>,
    currentFilter: { property: string | null; min: number; max: number; filterIndex: number },
  ) => {
    const filterCondition = layerAttributes[layerId].filterConditions.find(index => index.index === currentFilter.filterIndex)
    if (filterCondition) {
      return [filterCondition.minValue, filterCondition.maxValue]
    }
    return [0, 0]
  }
  const handleDeleteFilter = (filterIndex: number) => {
    onFilterConditionDelete(layerId, filterIndex)
    const newFilters = filters.filter(filter => filter.filterIndex !== filterIndex)
    onFiltersChange(newFilters)
  }
  const getMinMaxPropertyValues = (layerId: string, property: string | undefined): [number, number] => {
    const features = layersData[layerId].features
    let minValue: number | null = null
    let maxValue: number | null = null

    for (const feature of features) {
      if (feature.properties && property !== undefined) {
        const propertyValue = feature.properties[property]

        if (typeof propertyValue === 'number') {
          minValue = minValue !== null ? Math.min(minValue, propertyValue) : propertyValue
          maxValue = maxValue !== null ? Math.max(maxValue, propertyValue) : propertyValue
        }
      }
    }
    return [minValue ?? 0, maxValue ?? 0]
  }
  return (
    <div className='flex w-full flex-col'>
      <div className='flex flex-col justify-between bg-zinc-700 items-center pt-4 w-full rounded-sm mb-4'>
        <div className='flex justify-between items-center w-11/12'>
          <SelectOption
            isMultiple={false}
            selectOptions={selectOptions}
            selectedOption={selectedOption}
            onOptionChange={handleInputChange}
          />
        </div>
        <div className='flex justify-end w-11/12 mt-4 pb-4'>
          <Button onClick={handleCreateSlider} className='bg-cyan-900 hover:bg-cyan-800' variant='contained' size='small'>
            Add Filter
          </Button>
        </div>
      </div>
      <div className='flex flex-col items-center w-full pb-4'>
        {filters.map(
          (filter, index) =>
            filter.property && (
              <div key={index} className='w-10/12'>
                {' '}
                <div className='flex justify-between'>
                  <label>{filter.property}</label>
                  <Tooltip title='Remove Filter' arrow>
                    <CustomDeleteIcon onClick={() => handleDeleteFilter(filter.filterIndex)}></CustomDeleteIcon>
                  </Tooltip>
                </div>
                <div className='flex justify-center'>
                  <CustomSlider
                    value={getSliderValues(layerAttributes, filter)}
                    valueLabelDisplay='auto'
                    min={filter.min}
                    max={filter.max}
                    step={0.1}
                    onChange={(event, newValue) => {
                      onSliderChange(layerId, filter.property, newValue)
                    }}
                  />
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  )
}
export default FilterOptions
