'use client'

import React, { useState, useEffect } from 'react'

import SelectOption from '@/components/select-menu/SelectOption'
import { Indicator, IndicatorData, Paginated, Topic } from '@/types/worldbankdata-types/WorldBankData'
import useHttp from '@/hooks/use-http'
import { LoadingButton } from '@mui/lab'
import { Option } from '@/types/common/Option'
import CustomDateRangePicker from '@/components/select-menu/CustomDateRangePicker'
import Header from '@/components/select-menu/Header'
import { ArrowBackIcon } from '@/app/styles/muiStyled'
import { allCountries, extractUniqueCountries, filterIndicators, getMinMaxYears, combineData } from '@/utils/WorldBankDataUtils'
import { GeoJSON } from '@/types/common/GeojsonTypes'
import { CircularProgress } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'

interface ChildComponentProps {
  geoJsonData: GeoJSON.FeatureCollection | null

  setWorldBankDataLayer(value: GeoJSON.FeatureCollection | null): void

  isLoadingCountryBoundaries: boolean
  errorCountryBoundaries: string | null
}

const SelectMenu: React.FC<ChildComponentProps> = ({
  geoJsonData,
  setWorldBankDataLayer,
  isLoadingCountryBoundaries,
  errorCountryBoundaries,
}) => {
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

  const { isLoading: isLoadingTopics, error: errorTopics, sendRequest: fetchTopics } = useHttp<Paginated<Topic>>()
  const { isLoading: isLoadingIndicators, error: errorIndicators, sendRequest: fetchIndicators } = useHttp<Paginated<Indicator>>()
  const { isLoading: isLoadingDataset, error: errorDataset, sendRequest: fetchData } = useHttp<Paginated<IndicatorData>>()

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

  const canFetchDataset = () => {
    return selectedTopic && selectedIndicator && !isLoadingTopics && !isLoadingIndicators
  }

  const addLayer = () => {
    const filteredIndicators = filterIndicators(selectedCountries, indicatorData, dateRangeStart.getFullYear(), dateRangeEnd.getFullYear())
    const wBankDataLayer = combineData(geoJsonData, filteredIndicators)
    setWorldBankDataLayer(wBankDataLayer)
    setFilteredIndicatorData(filteredIndicators)
  }

  const canAddLayer = () => {
    return indicatorData.length > 0 && selectedCountries.length > 0 && !startDateError && !endDateError
  }
  const extractIndicatorsData = (data: Paginated<IndicatorData>) => {
    const [, indicatorsData] = data

    if (indicatorsData.length == 0) {
      setIndicatorData([])
      return
    }

    const filteredIndicatorsData = indicatorsData.filter(item => item.value !== null && item.date !== null && item.country.value != null)

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
        url: `http://api.worldbank.org/v2/country/all/indicator/${selectedIndicator?.id}?per_page=20000&format=json`,
      },
      extractIndicatorsData,
    )
  }

  useEffect(() => {
    console.log(`selectedTopic: ${selectedTopic}`)
  }, [selectedTopic])

  useEffect(() => {
    console.log(`selectedIndicator: ${selectedIndicator}`)
  }, [selectedIndicator])

  useEffect(() => {
    console.log(`IndicatorOption: ${indicatorOptions}`)
  }, [indicatorOptions])

  useEffect(() => {
    console.log(`selectedDateRange: ${dateRangeStart}`)
  }, [dateRangeStart])

  useEffect(() => {
    console.log(`selectedDateRangeEnd: ${dateRangeEnd}`)
  }, [dateRangeEnd])

  useEffect(() => {
    console.log(indicatorData)
  }, [indicatorData])

  useEffect(() => {
    console.log(countriesOptions)
  }, [countriesOptions])

  useEffect(() => {
    console.log(selectedCountries)
  }, [selectedCountries])

  useEffect(() => {
    console.log(filteredIndicatorData)
  }, [filteredIndicatorData])

  return (
    <div className='relative flex z-10 h-screen items-center w-80 '>
      <div className={`absolute left-5 h-[96%] bg-zinc-900 duration-100 rounded ${open ? 'w-72' : 'w-0'}`}>
        <ArrowBackIcon
          onClick={() => setOpen(!open)}
          className={`absolute -right-7 top-0 bg-zinc-600 cursor-pointer rounded-sm hover:bg-zinc-400
                    ${!open && 'rotate-180'}`}
        ></ArrowBackIcon>

        <div className='relative h-full'>
          <Header></Header>
          <div className='h-[90%] overflow-y-auto overflow-x-hidden'>
            <div className='flex flex-col items-center'>
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
                  <div className='flex pt-9 w-[250px] justify-between '>
                    <h1 className='text-xs font-medium mt-4 text-zinc-200 '>DATASETS</h1>
                    <LoadingButton
                      className='bg-teal-800'
                      variant='contained'
                      disabled={!canFetchDataset()}
                      onClick={fetchDataset}
                      loading={isLoadingDataset}
                    >
                      Fetch data
                    </LoadingButton>
                  </div>
                  {!isLoadingTopics && !errorTopics && (
                    <div className='pt-11 w-[250px]'>
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
                  {indicatorData.length > 0 && (
                    <div className='pt-10 w-[250px]'>
                      <div className='flex justify-between pt-5 pb-7'>
                        <h1 className='font-xs  mt-4 text-zinc-200 '>Filter</h1>
                        <LoadingButton
                          className='bg-teal-800 rounded-3xl '
                          variant='contained'
                          size='small'
                          disabled={!canAddLayer()}
                          onClick={addLayer}
                        >
                          Add Layer
                        </LoadingButton>
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
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectMenu
