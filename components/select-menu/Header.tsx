import React, { useState } from 'react'
import HexagonIcon from '@mui/icons-material/Hexagon'
import { styled, Tooltip } from '@mui/material'
import LayersIcon from '@mui/icons-material/Layers'
import TuneIcon from '@mui/icons-material/Tune'
import DatasetIcon from '@mui/icons-material/Dataset'

const HexagonLogo = styled(HexagonIcon)({
  color: '#22d3ee',
})

interface ChildComponentProps {
  isLayersTabSelected: boolean
  isDatasetTabSelected: boolean
  isFilterTabSelected: boolean

  handleLayersIconClick: () => void
  handleFilterIconClick: () => void
  handleDatasetIconClick: () => void
}

const Header: React.FC<ChildComponentProps> = ({
  isLayersTabSelected,
  isDatasetTabSelected,
  isFilterTabSelected,
  handleLayersIconClick,
  handleFilterIconClick,
  handleDatasetIconClick,
}) => {
  return (
    <div className='min-h-1/8 bg-zinc-800 rounded overflow-hidden flex flex-col justify-between'>
      <div className='inline-flex items-center pl-5 pt-9 pb-3'>
        <HexagonLogo></HexagonLogo>
        <h1 className='text-cyan-400 pl-1 text-sm font-bold uppercase'>Data Visualization</h1>
      </div>
      <div className='inline-flex items-center pb-2 pt-2'>
        <div className='pl-5 w-full pr-5'>
          <div className='h-[1px] w-full bg-zinc-600 mb-2' />
          <Tooltip title='Datasets'>
            <DatasetIcon
              className={`cursor-pointer mr-2  ${isLayersTabSelected ? 'selected' : ''}`}
              onClick={handleDatasetIconClick}
              fontSize='medium'
              sx={isDatasetTabSelected ? { color: '#06b6d4', borderBottom: '1px solid #06b6d4' } : {}}
            ></DatasetIcon>
          </Tooltip>
          <Tooltip title='Layers'>
            <LayersIcon
              className={`cursor-pointer mr-2  ${isDatasetTabSelected ? 'selected' : ''}`}
              onClick={handleLayersIconClick}
              fontSize='medium'
              sx={isLayersTabSelected ? { color: '#06b6d4', borderBottom: '1px solid #06b6d4' } : {}}
            ></LayersIcon>
          </Tooltip>
          <Tooltip title='Filters'>
            <TuneIcon
              className={`cursor-pointer  ${isDatasetTabSelected ? 'selected' : ''}`}
              onClick={handleFilterIconClick}
              fontSize='medium'
              sx={isFilterTabSelected ? { color: '#06b6d4', borderBottom: '1px solid #06b6d4' } : {}}
            ></TuneIcon>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
export default Header
