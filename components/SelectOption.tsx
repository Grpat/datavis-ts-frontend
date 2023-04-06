import React from 'react'
import { Option } from '@/types/common/Option'
import {
  CustomAutocomplete,
  CustomPaper,
  CustomTextField,
} from '@/app/styles/muiStyled'

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
