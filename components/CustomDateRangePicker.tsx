import React from "react"

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import {CustomTextField} from "@/components/SelectOption"

interface CustomYearRangePickerProps {
    startYear: number | '';
    endYear: number | '';
    inputFormat: string
}


const CustomYearRangePicker: React.FC<CustomYearRangePickerProps> =  ({ startYear, endYear, inputFormat  }) => {

    return (
        <div className="flex justify-between gap-2">
            <DesktopDatePicker
                views={['year']}
                slots={{ textField: CustomTextField
                    }}
                slotProps={{
                    textField: {
                        variant: 'standard',
                        className: "bg-zinc-800 hover:bg-zinc-600 rounded-sm"
                    },
                    openPickerIcon:{
                        sx: {
                            marginRight: 1,
                            color: '#5eead4'
                        },
                    }
            }}
            />
            <DesktopDatePicker
                views={['year']}
                slots={{ textField: CustomTextField
                }}
                slotProps={{
                    textField: {
                        variant: 'standard',
                        className: "bg-zinc-800 hover:bg-zinc-600 rounded-sm"
                    },
                    openPickerIcon:{
                        sx: {
                            marginRight: 1,
                            color: '#5eead4'
                        },
                    }
            }}
            />
        </div>
    )
}

export default CustomYearRangePicker


