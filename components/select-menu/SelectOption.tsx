import React from 'react'
import { Option } from '@/types/common/Option'
import { CustomAutocomplete, CustomPaper, CustomTextField } from '@/app/styles/muiStyled'
import { Chip } from '@mui/material'

interface SingleSelectComponentProps {
  selectOptions: Option[]
  selectedOption: Option | null
  onOptionChange: (option: Option | null) => void
  isMultiple?: false
}

interface MultiSelectComponentProps {
  selectOptions: Option[]
  selectedOption: Option[] | []
  onOptionChange: (option: Option[] | []) => void
  isMultiple: true
}

type ChildComponentProps = SingleSelectComponentProps | MultiSelectComponentProps

const SelectOption: React.FC<ChildComponentProps> = ({ selectOptions, selectedOption, onOptionChange, isMultiple }) => {
  const handleInputChange = (e: any, value: any) => {
    onOptionChange(value)
  }
  const defaultProps = {
    options: selectOptions,
    getOptionLabel: (option: any) => option.value,
    PaperComponent: CustomPaper,
    multiple: isMultiple,
  }

  return (
    <div className='select-option'>
      <CustomAutocomplete
        {...defaultProps}
        value={selectedOption}
        renderOption={(props, option) => {
          const typedOption = option as Option
          return (
            <li {...props} key={typedOption.id}>
              {typedOption.value}
            </li>
          )
        }}
        renderTags={(tagValue, getTagProps) => {
          return tagValue.map((option, index) => (
            <Chip {...getTagProps({ index })} key={(option as Option).id} label={(option as Option).value} />
          ))
        }}
        onChange={handleInputChange}
        renderInput={params => (
          <CustomTextField {...params} className='bg-zinc-800 hover:bg-zinc-600 rounded-sm' {...params} fullWidth variant='standard' />
        )}
      />
    </div>
  )
}
export default SelectOption
