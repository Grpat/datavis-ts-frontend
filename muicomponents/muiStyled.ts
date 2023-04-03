import {Paper, styled} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";


export const CustomAutocomplete = styled(Autocomplete)({
    width: 250,
    overflow: 'hidden',
    clearIndicator:{
        color:"#06b6d4"
    }
});

export const CustomTextField = styled(TextField)({
  input: {
      color: "#a1a1aa",
      height: 26,
      marginLeft: 10,
  },
    '& fieldset.MuiOutlinedInput-notchedOutline': {
        borderColor: 'green',
    },
    marginTop: 3
});

export const CustomPaper = styled(Paper)({
    backgroundColor: '#27272a',
    color: '#a1a1aa',
});


