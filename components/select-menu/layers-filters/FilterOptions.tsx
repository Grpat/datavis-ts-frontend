import React, { useEffect, useMemo, useState } from 'react'
import { LayerAttribute, LayerDataRecord } from '@/types/common/LayersTypes'
import { Option } from '@/types/common/Option'
import SelectOption from '@/components/select-menu/SelectOption'
import { Button, Slider } from '@mui/material'

interface FilterOptionsProps {
  layerId: string
  layersData: LayerDataRecord
  onPropertySelected: (property: string | null, layerId: string, min: number, max: number, filterIndex: number) => void
  onSliderChange: (layerId: string, selectedProperty: string | null, newValue: number[] | number) => void
  filters: Array<{ property: string | null; min: number; max: number; filterIndex: number }>
  onFiltersChange: (newFilters: Array<{ property: string | null; min: number; max: number; filterIndex: number }>) => void
  layerAttributes: Record<string, LayerAttribute>
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  layersData,
  layerId,
  onPropertySelected,
  onSliderChange,
  filters,
  onFiltersChange,
  layerAttributes,
}) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  const addNewFilter = (property: string | null, min: number, max: number, filterIndex: number) => {
    onFiltersChange([...filters, { property, min, max, filterIndex }])
  }
  //const [sliderValues, setSliderValues] = useState<Record<number, [number, number]>>({})
  const getPropertyKeys = (layerId: string): string[] => {
    const features = layersData[layerId].features
    const propertyKeysSet = new Set<string>()

    for (const feature of features) {
      for (const key in feature.properties) {
        const value = feature.properties[key]
        if (typeof value === 'number') {
          propertyKeysSet.add(key)
        }
      }
    }
    return Array.from(propertyKeysSet)
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

  const propertyKeys = useMemo(() => getPropertyKeys(layerId), [layerId])
  const selectOptions: Option[] = propertyKeys.map(key => ({
    id: key,
    value: key,
  }))
  const handleInputChange = (option: Option | null) => {
    if (!option) return
    setSelectedOption(option)
  }

  const handleCreateSlider = () => {
    if (!selectedOption) return
    const [minValue, maxValue] = getMinMaxPropertyValues(layerId, selectedOption.value)
    const filterIndex = filters?.length || 0
    onPropertySelected(selectedOption.value || null, layerId, minValue, maxValue, filterIndex)
    addNewFilter(selectedOption.value, minValue, maxValue, filterIndex)
  }

  return (
    <div className='flex w-full flex-col bg-zinc-700 rounded-sm pb-4'>
      <div className='flex flex-col justify-between items-center mt-4 w-full'>
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
      <div className='flex flex-col items-center w-full'>
        {filters.map(
          (filter, index) =>
            filter.property && (
              <div key={index} className='w-10/12'>
                {' '}
                <label>{filter.property}</label>
                <div className='flex justify-center'>
                  <Slider
                    defaultValue={[filter.min, filter.max]}
                    //defaultValue={layerAttributes[layerId].filterConditions.map(x=>)}
                    min={filter.min}
                    max={filter.max}
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
