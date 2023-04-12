import React, { useState } from 'react'

import { DesktopDatePicker, DesktopDatePickerProps } from '@mui/x-date-pickers/DesktopDatePicker'
import { DesktopDatePickerSlotsComponentsProps } from '@mui/x-date-pickers/DesktopDatePicker/DesktopDatePicker.types'
import { CustomPaper, CustomTextField } from '@/app/styles/muiStyled'
import { FormHelperText } from '@mui/material'

const datePickerSlotProps: DesktopDatePickerSlotsComponentsProps<any> = {
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
  layout: {
    sx: {
      width: '250px',
    },
  },

  desktopPaper: {
    sx: {
      '& .MuiDateCalendar-root': {
        width: 250,
      },
      '& .MuiYearCalendar-root': {
        width: 250,
      },
    },
  },
}

interface CustomYearRangePickerProps {
  dateStart: Date
  dateEnd: Date

  minDate: Date
  maxDate: Date

  setDateStart(value: Date): void

  setDateEnd(value: Date): void

  setStartDateError(value: string | null): void

  setEndDateError(value: string | null): void

  endDateError: string | null
  startDateError: string | null
}

const defaultProps: DesktopDatePickerProps<any> = {
  views: ['year'],
  yearsPerRow: 3,
  disableFuture: true,
  slotProps: datePickerSlotProps,
}

const CustomYearRangePicker: React.FC<CustomYearRangePickerProps> = ({
  dateStart,
  setDateStart,
  dateEnd,
  setDateEnd,
  minDate,
  maxDate,
  startDateError,
  setStartDateError,
  endDateError,
  setEndDateError,
}) => {
  const handleStartDateChange = (newStartDate: any) => {
    if (newStartDate <= dateEnd && newStartDate >= minDate) {
      setDateStart(newStartDate)
      setStartDateError(null)
    } else {
      setStartDateError('Invalid date')
    }
  }

  const handleEndDateChange = (newEndDate: any) => {
    if (newEndDate >= dateStart && newEndDate <= maxDate) {
      setDateEnd(newEndDate)
      setEndDateError(null)
    } else {
      setEndDateError('Invalid date')
    }
  }

  return (
    <div className='flex justify-between gap-2'>
      <DesktopDatePicker
        {...defaultProps}
        onChange={handleStartDateChange}
        value={dateStart}
        maxDate={dateEnd}
        minDate={minDate}
        slots={{
          textField: props => <CustomTextField {...props} helperText={startDateError ?? startDateError} />,
          desktopPaper: CustomPaper,
        }}
      />
      <DesktopDatePicker
        {...defaultProps}
        onChange={handleEndDateChange}
        value={dateEnd}
        minDate={dateStart}
        maxDate={maxDate}
        slots={{
          textField: props => <CustomTextField {...props} helperText={endDateError ?? endDateError} />,
          desktopPaper: CustomPaper,
        }}
      />
    </div>
  )
}

export default CustomYearRangePicker
