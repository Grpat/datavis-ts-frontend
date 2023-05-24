import { Paper, styled } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Slider, Switch } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ClearAllIcon from '@mui/icons-material/ClearAll'

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
export const ArrowBackIcon = styled(ArrowBackIosNewIcon)({
  fontSize: 'medium',
  color: '#38bdf8',
})
export const CustomPaper = styled(Paper)({
  backgroundColor: '#27272a',
  color: '#a1a1aa',
})
export const CustomVisibilityIcon = styled(VisibilityIcon)`
  font-size: small;

  &:hover {
    color: #e4e4e7;
  }
`
export const CustomDeleteIcon = styled(DeleteIcon)`
  font-size: medium;

  &:hover {
    color: #f43f5e;
  }
`
export const CustomContentCopyIcon = styled(ContentCopyIcon)`
  font-size: medium;

  &:hover {
    color: #e4e4e7;
  }
`
export const CustomVisibilityOffIcon = styled(VisibilityOffIcon)`
  font-size: small;

  &:hover {
    color: #e4e4e7;
  }
`
export const CustomDropDown = styled(ArrowDropDownIcon)`
  font-size: medium;

  &:hover {
    color: #e4e4e7;
  }
`

export const CustomClearAllIcon = styled(ClearAllIcon)`
  font-size: medium;

  &:hover {
    color: #f43f5e;
  }
`
export const CustomAddIcon = styled(AddIcon)`
  font-size: small;

  &:hover {
    color: #e4e4e7;
  }
`
export const CustomSlider = styled(Slider)({
  //color: '#64748b',

  '& .MuiSlider-thumb': {
    borderRadius: '1px',
    width: '13px',
    height: '13px',
  },
  '& .MuiSlider-rail': {
    height: '4px',
    borderRadius: '0px',
  },
  '& .MuiSlider-track': {
    height: '4px',
    borderRadius: '0px',
  },
  '& .MuiSlider-mark': { borderRadius: '0px', backgroundColor: '#cbd5e1' },
})

export const CustomSwitch = styled(Switch)({
  //marginTop: 2,
  '& .MuiSwitch-thumb': {
    '&:before': {
      color: '#fb923c',
    },
    //color: '#64748b',
    //borderRadius: 1,
    //width: '13px',
    //height: '13px',
  },
  '& .MuiSwitch-track': {
    // borderRadius: 1,
    //height: '7px',
    backgroundColor: '#cbd5e1',
  },
})
export const FileUploadStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
  borderRadius: 1,
}
