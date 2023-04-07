'use client'

import React, { useState, useEffect } from 'react'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import HexagonIcon from '@mui/icons-material/Hexagon'
import SelectOption from '@/components/select-menu/SelectOption'
import { Indicator, Paginated, Topic } from '@/types/worldbankdata-types/WorldBankData'
import useHttp from '@/hooks/use-http'
import { styled } from '@mui/material'
import { Option } from '@/types/common/Option'
import CustomDateRangePicker from '@/components/select-menu/CustomDateRangePicker'
import Header from '@/components/select-menu/Header'

const ArrowBackIcon = styled(ArrowBackIosNewIcon)({
  fontSize: 'medium',
  color: '#5eead4',
})

const SelectMenu = () => {
  const [open, setOpen] = useState(true)
  const [topicOptions, setTopicOptions] = useState<Option[]>([])
  const [indicatorOptions, setIndicatorOptions] = useState<Option[]>([])

  const [selectedTopic, setSelectedTopic] = useState<Option | null>(null)
  const [selectedIndicator, setSelectedIndicator] = useState<Option | null>(null)

  const [dateRangeStart, setDateRangeStart] = useState<Date>(new Date(2021, 0, 1))
  const [dateRangeEnd, setDateRangeEnd] = useState<Date>(new Date(2021, 0, 1))

  const { isLoading: isLoadingTopics, error: errorTopics, sendRequest: fetchTopics } = useHttp<Paginated<Topic>>()
  const { isLoading: isLoadingIndicators, error: errorIndicators, sendRequest: fetchIndicators } = useHttp<Paginated<Indicator>>()

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

  const extractIndicatorsData = (data: Paginated<Indicator>) => {
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
    setSelectedIndicator(null)

    if (option == null) return

    fetchIndicators(
      {
        url: `http://api.worldbank.org/v2/topic/${option.id}/indicator?format=json&per_page=20000`,
      },
      extractIndicatorsData,
    )
  }

  const handleIndicatorChange = (option: Option | null) => {
    setSelectedIndicator(option)
    if (option == null) return
  }

  /* useEffect(() => {
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
  }, [dateRangeEnd])*/

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
              {!isLoadingTopics && !errorTopics && (
                <div className='pt-7 w-[250px]'>
                  <label className='font-thin pb-5'>Select Topic</label>
                  <SelectOption selectOptions={topicOptions} selectedOption={selectedTopic} onOptionChange={handleTopicChange} />
                </div>
              )}

              {selectedTopic && (
                <div className=' pt-7 w-[250px]'>
                  <label className='font-thin mb-4 pb-4'>Indicator</label>
                  <SelectOption
                    selectOptions={indicatorOptions}
                    selectedOption={selectedIndicator}
                    onOptionChange={handleIndicatorChange}
                  />
                </div>
              )}
              {selectedIndicator && selectedTopic && (
                <div className='pt-7 w-[250px]'>
                  <label className='font-thin'>Date Range</label>
                  <CustomDateRangePicker
                    dateStart={dateRangeStart}
                    setDateStart={setDateRangeStart}
                    dateEnd={dateRangeEnd}
                    setDateEnd={setDateRangeEnd}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectMenu
