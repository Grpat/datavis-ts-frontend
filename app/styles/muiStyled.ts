import { Paper, styled } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

export const CustomAutocomplete = styled(Autocomplete)({
  overflow: 'hidden',
  clearIndicator: {
    color: '#06b6d4',
  },
})
export const CustomTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    height: 19,
    marginLeft: 10,
  },
})

export const CustomPaper = styled(Paper)({
  backgroundColor: '#27272a',
  color: '#a1a1aa',
})
