'use client'

import React, { useState, useEffect } from 'react'

import SelectOption from '@/components/select-menu/SelectOption'
import {
  Indicator,
  IndicatorData,
  Paginated,
  Topic,
} from '@/types/worldbankdata-types/WorldBankData'
import useHttp from '@/hooks/use-http'
import { LoadingButton } from '@mui/lab'
import { Option } from '@/types/common/Option'
import CustomDateRangePicker from '@/components/select-menu/CustomDateRangePicker'
import Header from '@/components/select-menu/Header'
import { ArrowBackIcon } from '@/app/styles/muiStyled'
import {
  allCountries,
  extractUniqueCountries,
  filterIndicators,
  getMinMaxYears,
  combineData,
} from '@/utils/WorldBankDataUtils'
import { GeoJSON } from '@/types/common/GeojsonTypes'
import { Button, ButtonGroup, CircularProgress } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'

import { GeoJsonLayer } from '@deck.gl/layers/typed'
import LayersTab from '@/components/select-menu/layers-tab/LayersTab'
import FiltersTab from '@/components/select-menu/layers-filters/FiltersTab'
import { LayerAttribute, LayerDataRecord } from '@/types/common/LayersTypes'
import FileUploadModal from '@/components/select-menu/FileUploadModal'

interface ChildComponentProps {
  geoJsonData: GeoJSON.FeatureCollection | null

  onAddLayer(value: GeoJSON.FeatureCollection | null): void

  isLoadingCountryBoundaries: boolean
  errorCountryBoundaries: string | null
  layers: GeoJsonLayer[]
  layersData: LayerDataRecord

  onDeleteLayer(layerId: string): void

  onToggleVisibilityLayer(layerId: string): void

  onCopyLayer(layerId: string): void

  onElevationRangeChange: (layerId: string, newElevationRange: number) => void
  onOpacityChange: (layerId: string, newOpacityValue: number) => void
  onColorScaleChange: (layerId: string, newOpacityValue: number) => void
  onPropertySelected: (
    property: string | null,
    layerId: string,
    min: number,
    max: number,
    filterIndex: number,
  ) => void
  onSliderChange: (
    layerId: string,
    selectedProperty: string | null,
    newValue: number[] | number,
  ) => void
  filters: Record<
    string,
    Array<{ property: string | null; min: number; max: number; filterIndex: number }>
  >
  setFilters: (
    newFilters: Record<
      string,
      Array<{ property: string | null; min: number; max: number; filterIndex: number }>
    >,
  ) => void
  layerAttributes: Record<string, LayerAttribute>
  onFilterConditionDelete: (layerId: string, filterIndex: number) => void
  onClearAllFilters: (layerId: string) => void
  onPropertyElevationChange: (layerId: string, newElevationProperty: string) => void
  onPropertyColorChange: (layerId: string, newElevationProperty: string) => void
}

const SelectMenu: React.FC<ChildComponentProps> = ({
  geoJsonData,
  layersData,
  onAddLayer,
  isLoadingCountryBoundaries,
  errorCountryBoundaries,
  layers,
  onDeleteLayer,
  onToggleVisibilityLayer,
  onCopyLayer,
  onElevationRangeChange,
  onColorScaleChange,
  onOpacityChange,
  onPropertySelected,
  onSliderChange,
  filters,
  setFilters,
  layerAttributes,
  onFilterConditionDelete,
  onClearAllFilters,
  onPropertyElevationChange,
  onPropertyColorChange,
}) => {
  const [isLayersTabSelected, setLayersTabSelected] = useState(false)
  const [isDatasetTabSelected, setDatasetTabSelected] = useState(true)
  const [isFilterTabSelected, setFilterTabSelected] = useState(false)
  const [open, setOpen] = useState(true)

  const [topicOptions, setTopicOptions] = useState<Option[]>([])
  const [indicatorOptions, setIndicatorOptions] = useState<Option[]>([])
  const [countriesOptions, setCountriesOptions] = useState<Option[]>([])

  const [indicatorData, setIndicatorData] = useState<IndicatorData[]>([])
  const [filteredIndicatorData, setFilteredIndicatorData] = useState<IndicatorData[]>([])

  const [selectedTopic, setSelectedTopic] = useState<Option | null>(null)
  const [selectedIndicator, setSelectedIndicator] = useState<Option | null>(null)
  const [selectedCountries, setSelectedCountries] = useState<Option[]>([allCountries])

  const [startDateError, setStartDateError] = useState<string | null>(null)
  const [endDateError, setEndDateError] = useState<string | null>(null)
  const [dateRangeStart, setDateRangeStart] = useState<Date>(new Date(2021, 0, 1))
  const [dateRangeEnd, setDateRangeEnd] = useState<Date>(new Date(2021, 0, 1))
  const [minDate, setMinDate] = useState<Date>(new Date(2021, 0, 1))
  const [maxDate, setMaxDate] = useState<Date>(new Date(2021, 0, 1))

  const [selectedElevationProp, setSelectedElevationProp] = useState<Option | null>(null)
  const [selectedColorProp, setSelectedColorProp] = useState<Option | null>(null)

  const {
    isLoading: isLoadingTopics,
    error: errorTopics,
    sendRequest: fetchTopics,
  } = useHttp<Paginated<Topic>>()
  const {
    isLoading: isLoadingIndicators,
    error: errorIndicators,
    sendRequest: fetchIndicators,
  } = useHttp<Paginated<Indicator>>()
  const {
    isLoading: isLoadingDataset,
    error: errorDataset,
    sendRequest: fetchData,
  } = useHttp<Paginated<IndicatorData>>()

  useEffect(() => {
    const extractTopicsData = (data: Paginated<Topic>) => {
      const [, topicsData] = data

      const topicOptions: Option[] = topicsData.map(topic => ({
        id: topic.id,
        value: topic.value,
      }))
      setTopicOptions(topicOptions)
    }

    fetchTopics(
      {
        url: 'https://api.worldbank.org/v2/topic?format=json&per_page=20000',
      },
      extractTopicsData,
    )
  }, [fetchTopics])

  const extractIndicators = (data: Paginated<Indicator>) => {
    const [, indicatorsData] = data
    const newIndicatorOptions: Option[] = indicatorsData.map(indicator => ({
      id: indicator.id,
      value: indicator.name,
    }))

    setIndicatorOptions(newIndicatorOptions)
  }

  const handleTopicChange = async (option: Option | null) => {
    setSelectedTopic(option)
    setIndicatorOptions([])
    setIndicatorData([])
    setSelectedIndicator(null)

    if (option == null) return

    fetchIndicators(
      {
        url: `http://api.worldbank.org/v2/topic/${option.id}/indicator?format=json&per_page=20000`,
      },
      extractIndicators,
    )
  }
  const handleIndicatorChange = (option: Option | null) => {
    if (option == null) setIndicatorData([])
    setIndicatorData([])
    setSelectedIndicator(option)
  }
  const handleCountriesChange = (option: Option[] | []) => {
    if (option.length <= 0) setSelectedCountries([])
    setSelectedCountries(option)
  }
  const handleLayersIconClick = () => {
    setLayersTabSelected(true)
    setDatasetTabSelected(false)
    setFilterTabSelected(false)
  }
  const handleFilterIconClick = () => {
    setFilterTabSelected(true)
    setLayersTabSelected(false)
    setDatasetTabSelected(false)
  }

  const handleDatasetIconClick = () => {
    setDatasetTabSelected(true)
    setLayersTabSelected(false)
    setFilterTabSelected(false)
  }

  const canFetchDataset = () => {
    return selectedTopic && selectedIndicator && !isLoadingTopics && !isLoadingIndicators
  }

  const addLayer = () => {
    const filteredIndicators = filterIndicators(
      selectedCountries,
      indicatorData,
      dateRangeStart.getFullYear(),
      dateRangeEnd.getFullYear(),
    )
    const wBankDataLayer = combineData(geoJsonData, filteredIndicators)
    setFilteredIndicatorData(filteredIndicators)
    onAddLayer(wBankDataLayer)
  }

  const canAddLayer = () => {
    return (
      indicatorData.length > 0 && selectedCountries.length > 0 && !startDateError && !endDateError
    )
  }
  const extractIndicatorsData = (data: Paginated<IndicatorData>) => {
    const [, indicatorsData] = data

    if (indicatorsData.length == 0) {
      setIndicatorData([])
      return
    }

    const filteredIndicatorsData = indicatorsData.filter(
      item => item.value !== null && item.date !== null && item.country.value != null,
    )

    //set min/max dates for calendar filter
    const minMaxYears = getMinMaxYears(filteredIndicatorsData)
    const uniqueCountries = extractUniqueCountries(filteredIndicatorsData)

    setMinDate(new Date(minMaxYears.minYear, 0, 1))
    setMaxDate(new Date(minMaxYears.maxYear, 0, 1))
    setDateRangeStart(new Date(minMaxYears.maxYear, 0, 1))
    setDateRangeEnd(new Date(minMaxYears.maxYear, 0, 1))

    setCountriesOptions(uniqueCountries)
    setSelectedCountries([allCountries])

    setIndicatorData(filteredIndicatorsData)
  }

  const fetchDataset = async () => {
    if (!canFetchDataset()) return
    fetchData(
      {
        url: `http://api.worldbank.org/v2/country/all/indicator/${selectedIndicator?.id}
        ?per_page=20000&format=json`,
      },
      extractIndicatorsData,
    )
  }
  const handleElevationPropertyChange = (option: Option | null, layerId: string) => {
    if (!option) return
    setSelectedElevationProp(option)
    onPropertyElevationChange(layerId, option.value)
  }
  const handleColorPropertyChange = (option: Option | null, layerId: string) => {
    if (!option) return
    setSelectedColorProp(option)
    onPropertyColorChange(layerId, option.value)
  }

  return (
    <div className='relative flex z-10 h-screen items-center w-80 '>
      <div
        className={`absolute left-5 h-[96%] bg-zinc-900 duration-100 rounded ${
          open ? 'w-72' : 'w-0'
        }`}
      >
        <ArrowBackIcon
          onClick={() => setOpen(!open)}
          className={`absolute -right-7 top-0 bg-zinc-900 cursor-pointer rounded-sm hover:bg-zinc-600
                ${!open && 'rotate-180'}`}
        ></ArrowBackIcon>
        <div className='h-full flex flex-col'>
          <Header
            isLayersTabSelected={isLayersTabSelected}
            isDatasetTabSelected={isDatasetTabSelected}
            isFilterTabSelected={isFilterTabSelected}
            handleFilterIconClick={handleFilterIconClick}
            handleDatasetIconClick={handleDatasetIconClick}
            handleLayersIconClick={handleLayersIconClick}
          ></Header>
          <div className='flex-1 overflow-y-auto overflow-x-hidden'>
            <div className='flex flex-col items-center'>
              {isDatasetTabSelected ? (
                <>
                  {isLoadingCountryBoundaries ? (
                    <div className='flex pt-9 w-[250px] space-x-11 '>
                      <CircularProgress color='success' />
                      <h1 className='text-xs mt-4 text-zinc-200 '>LOADING GEODATA...</h1>
                    </div>
                  ) : errorCountryBoundaries ? (
                    <div className='flex pt-11 w-[250px] space-x-2'>
                      <ErrorIcon sx={{ color: '#f87171' }}></ErrorIcon>
                      <h1 className='text-xs text-red-400 m-auto'>ERROR: Failed to load geodata</h1>
                    </div>
                  ) : (
                    <>
                      <div className='flex pt-9 w-[250px] justify-between'>
                        <h1 className='font-medium mt-2 text-zinc-200 '>DATASETS</h1>
                        <FileUploadModal onAddLayer={onAddLayer}></FileUploadModal>
                      </div>
                      <div className='h-[1px] w-[250px] bg-zinc-600 mt-6 mb-2' />
                      <h1 className='font-medium mt-2 text-zinc-200 '>World Bank Data</h1>
                      {!isLoadingTopics && !errorTopics && (
                        <div className='pt-9 w-[250px]'>
                          <label className='font-thin pb-5'>Topic</label>
                          <SelectOption
                            isMultiple={false}
                            selectOptions={topicOptions}
                            selectedOption={selectedTopic}
                            onOptionChange={handleTopicChange}
                          />
                        </div>
                      )}
                      {selectedTopic && (
                        <div className=' pt-7 w-[250px]'>
                          <label className='font-thin mb-4 pb-4'>Indicator</label>
                          <SelectOption
                            isMultiple={false}
                            selectOptions={indicatorOptions}
                            selectedOption={selectedIndicator}
                            onOptionChange={handleIndicatorChange}
                          />
                        </div>
                      )}
                      <div className='flex pt-7 w-[250px] justify-end'>
                        <LoadingButton
                          className='bg-cyan-900 hover:bg-cyan-800'
                          variant='contained'
                          size='small'
                          disabled={!canFetchDataset()}
                          onClick={fetchDataset}
                          loading={isLoadingDataset}
                        >
                          Fetch data
                        </LoadingButton>
                      </div>
                      {indicatorData.length > 0 && (
                        <div className='pt-7 w-[250px]'>
                          <div className='flex justify-start  pb-7'>
                            <h1 className='font-xs mt-2 text-zinc-200 '>Filter</h1>
                          </div>
                          <label className='font-thin'>Range</label>
                          <CustomDateRangePicker
                            minDate={minDate}
                            maxDate={maxDate}
                            dateStart={dateRangeStart}
                            setDateStart={setDateRangeStart}
                            dateEnd={dateRangeEnd}
                            setDateEnd={setDateRangeEnd}
                            setStartDateError={setStartDateError}
                            setEndDateError={setEndDateError}
                            startDateError={startDateError}
                            endDateError={endDateError}
                          />
                        </div>
                      )}
                      {indicatorData.length > 0 && (
                        <div className='pt-7 w-[250px]'>
                          <label className='font-thin mb-4 pb-4'>Countries</label>
                          <SelectOption
                            isMultiple={true}
                            selectOptions={countriesOptions}
                            selectedOption={selectedCountries}
                            onOptionChange={handleCountriesChange}
                          />
                          <div className='flex justify-end  pt-7'>
                            <LoadingButton
                              className='bg-cyan-900 hover:bg-cyan-800'
                              variant='contained'
                              size='small'
                              disabled={!canAddLayer()}
                              onClick={addLayer}
                            >
                              Add Layer
                            </LoadingButton>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : isLayersTabSelected ? (
                <LayersTab
                  layers={layers}
                  onDeleteLayer={onDeleteLayer}
                  onToggleVisibilityLayer={onToggleVisibilityLayer}
                  onCopyLayer={onCopyLayer}
                  onElevationRangeChange={onElevationRangeChange}
                  onColorScaleChange={onColorScaleChange}
                  onOpacityChange={onOpacityChange}
                  layersData={layersData}
                  selectedElevationProp={selectedElevationProp}
                  setSelectedElevationProp={setSelectedElevationProp}
                  onPropertyElevationChange={handleElevationPropertyChange}
                  selectedColorProp={selectedColorProp}
                  setSelectedColorProp={setSelectedColorProp}
                  onPropertyColorChange={handleColorPropertyChange}
                ></LayersTab>
              ) : isFilterTabSelected ? (
                <FiltersTab
                  layers={layers}
                  layersData={layersData}
                  onPropertySelected={onPropertySelected}
                  onSliderChange={onSliderChange}
                  layerAttributes={layerAttributes}
                  filters={filters}
                  setFilters={setFilters}
                  onFilterConditionDelete={onFilterConditionDelete}
                  onClearAllFilters={onClearAllFilters}
                ></FiltersTab>
              ) : null}
              <div className='pt-16 pb-7 w-[250px]'>
                <div className='h-[1px] w-full bg-zinc-600 mb-2' />
                <h1 className='font-medium mt-4 text-zinc-200 mb-4'>LAYERS ({layers.length})</h1>
                <ButtonGroup
                  variant='contained'
                  color='success'
                  aria-label='outlined button group'
                  className='w-full'
                >
                  <Button
                    className='bg-cyan-900 hover:bg-cyan-800 w-1/2 '
                    size='small'
                    onClick={handleLayersIconClick}
                  >
                    Manage
                  </Button>
                  <Button
                    className='bg-cyan-900 hover:bg-cyan-800 w-1/2'
                    size='small'
                    onClick={handleFilterIconClick}
                  >
                    Filter
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectMenu
