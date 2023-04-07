import React, { useState } from 'react'

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { DesktopDatePickerSlotsComponentsProps } from '@mui/x-date-pickers/DesktopDatePicker/DesktopDatePicker.types'
import { CustomPaper, CustomTextField } from '@/app/styles/muiStyled'

const datePickerSlotProps: DesktopDatePickerSlotsComponentsProps<unknown> = {
  textField: {
    variant: 'standard',
    className: 'bg-zinc-800 hover:bg-zinc-600 rounded-sm',
  },
  openPickerIcon: {
    sx: {
      marginRight: 1,
      color: '#5eead4',
    },
  },
}

interface CustomYearRangePickerProps {
  dateStart: Date
  dateEnd: Date
  setDateStart(value: Date): void
  setDateEnd(value: Date): void
}

const CustomYearRangePicker: React.FC<CustomYearRangePickerProps> = ({ dateStart, setDateStart, dateEnd, setDateEnd }) => {
  const handleStartDateChange = (newStartDate: any) => {
    setDateStart(newStartDate)
  }

  const handleEndDateChange = (newEndDate: any) => {
    setDateEnd(newEndDate)
  }

  return (
    <div className='flex justify-between gap-2'>
      <DesktopDatePicker
        onChange={handleStartDateChange}
        value={dateStart}
        views={['year']}
        maxDate={dateEnd}
        yearsPerRow={3}
        slots={{
          textField: CustomTextField,
          desktopPaper: CustomPaper,
        }}
        slotProps={datePickerSlotProps}
      />
      <DesktopDatePicker
        onChange={handleEndDateChange}
        value={dateEnd}
        minDate={dateStart}
        views={['year']}
        yearsPerRow={3}
        slots={{
          textField: CustomTextField,
          desktopPaper: CustomPaper,
        }}
        slotProps={datePickerSlotProps}
      />
    </div>
  )
}

export default CustomYearRangePicker
