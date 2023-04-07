import React from 'react'
import { Option } from '@/types/common/Option'
import { CustomAutocomplete, CustomPaper, CustomTextField } from '@/app/styles/muiStyled'

interface ChildComponentProps {
  selectOptions: Option[]
  selectedOption: Option | null
  onOptionChange: (option: Option | null) => void
}

const SelectOption: React.FC<ChildComponentProps> = ({ selectOptions, selectedOption, onOptionChange }) => {
  const handleInputChange = (e: any, value: any) => {
    onOptionChange(value)
  }

  return (
    <div className='select-option'>
      <CustomAutocomplete
        value={selectedOption}
        options={selectOptions}
        getOptionLabel={option => (option as { value: string }).value}
        renderOption={(props, option) => {
          const typedOption = option as Option
          return (
            <li {...props} key={typedOption.id}>
              {typedOption.value}
            </li>
          )
        }}
        onChange={handleInputChange}
        PaperComponent={CustomPaper}
        renderInput={params => (
          <CustomTextField key={params.id} className='bg-zinc-800 hover:bg-zinc-600 rounded-sm' {...params} fullWidth variant='standard' />
        )}
      />
    </div>
  )
}
export default SelectOption
