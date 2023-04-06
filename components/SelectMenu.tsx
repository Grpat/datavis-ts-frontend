'use client'

import React, { useState, useEffect } from 'react'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import HexagonIcon from '@mui/icons-material/Hexagon'
import SelectOption from '@/components/SelectOption'
import {
  Indicator,
  Paginated,
  Topic,
} from '@/types/worldbankdata-types/WorldBankData'
import useHttp, { UseHttpResult } from '@/hooks/use-http'
import { styled } from '@mui/material'
import { Option } from '@/types/common/Option'
import CustomDateRangePicker from '@/components/CustomDateRangePicker'

const ArrowBackIcon = styled(ArrowBackIosNewIcon)({
  fontSize: 'medium',
  color: '#5eead4',
})
const HexagonLogo = styled(HexagonIcon)({
  color: '#5eead4',
})

const SelectMenu = () => {
  const [open, setOpen] = useState(true)
  const [topicOptions, setTopicOptions] = useState<Option[]>([])
  const [indicatorOptions, setIndicatorOptions] = useState<Option[]>([])

  const [selectedTopic, setSelectedTopic] = useState<Option | null>(null)
  const [selectedIndicator, setSelectedIndicator] = useState<Option | null>(
    null,
  )

  const {
    isLoading,
    error,
    sendRequest: fetchTopics,
  } = useHttp<Paginated<Topic>>()
  const {
    isLoading: isLoading2,
    error: error2,
    sendRequest: fetchIndicators,
  } = useHttp<Paginated<Indicator>>()

  useEffect(() => {
    const extractTopicsData = (data: Paginated<Topic>) => {
      const [, topicsData] = data

      const topicOptions: Option[] = topicsData.map((topic) => ({
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

    const newIndicatorOptions: Option[] = indicatorsData.map((indicator) => ({
      id: indicator.id,
      value: indicator.name,
    }))

    setIndicatorOptions(newIndicatorOptions)
  }
  const handleTopicChange = async (option: Option | null) => {
    setSelectedTopic(option)
    setIndicatorOptions([])

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

  return (
    <div className="relative flex z-10 h-screen items-center w-80 ">
      <div
        className={`absolute left-5 h-[96%] bg-zinc-900 duration-100 rounded ${
          open ? 'w-72' : 'w-0'
        }`}
      >
        <ArrowBackIcon
          onClick={() => setOpen(!open)}
          className={`absolute -right-7 top-0 bg-zinc-600 cursor-pointer rounded-sm hover:bg-zinc-400
                    ${!open && 'rotate-180'}`}
        ></ArrowBackIcon>
        <div className="relative h-full">
          <div className="h-[10%] bg-zinc-800 rounded overflow-hidden flex items-center">
            <div className="inline-flex items-center pl-5 z-10">
              <HexagonLogo></HexagonLogo>
              <h1 className="text-teal-400 pl-1 text-sm font-bold uppercase">
                Data Visualization
              </h1>
            </div>
          </div>
          <div className="h-[90%] overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col items-center">
              {!isLoading && !error && (
                <div className="pt-5 w-[250px]">
                  <label className="font-thin">Select Topic</label>
                  <SelectOption
                    selectOptions={topicOptions}
                    onOptionChange={handleTopicChange}
                  />
                </div>
              )}
              {selectedTopic && (
                <div className=" pt-5 w-[250px]">
                  <label className="font-thin">Indicator</label>
                  <SelectOption
                    selectOptions={indicatorOptions}
                    onOptionChange={handleIndicatorChange}
                  />
                </div>
              )}
              <div className="pt-5 w-[250px]">
                <label className="font-thin">Date Range</label>
                <CustomDateRangePicker
                  startYear={1950}
                  endYear={2022}
                  inputFormat={'yyyy'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectMenu
