import React, { useEffect, useState } from 'react'

import { Paper, styled } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Option } from '@/types/common/Option'

const CustomAutocomplete = styled(Autocomplete)({
  width: 250,
  overflow: 'hidden',
  clearIndicator: {
    color: '#06b6d4',
  },
})
export const CustomTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    height: 22,
    marginLeft: 10,
  },
})

export const CustomPaper = styled(Paper)({
  backgroundColor: '#27272a',
  color: '#a1a1aa',
})

interface ChildComponentProps {
  selectOptions: Option[]
  onOptionChange: (option: Option | null) => void
}

const SelectOption: React.FC<ChildComponentProps> = ({
  selectOptions,
  onOptionChange,
}) => {
  const handleInputChange = (e: any, value: any) => {
    onOptionChange(value)
  }

  return (
    <div className="select-option">
      <CustomAutocomplete
        options={selectOptions}
        getOptionLabel={(option) => (option as { value: string }).value}
        onChange={handleInputChange}
        PaperComponent={CustomPaper}
        renderInput={(params) => (
          <CustomTextField
            className="bg-zinc-800 hover:bg-zinc-600 rounded-sm"
            {...params}
            fullWidth
            variant="standard"
          />
        )}
      />
    </div>
  )
}
export default SelectOption
