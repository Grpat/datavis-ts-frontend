import { createTheme } from '@mui/material'

export const theme = createTheme({
  palette: {
    success: {
      main: '#0891b2', // Replace with your desired color
    },
    text: {
      primary: '#a1a1aa',
    },
  },
  typography: {
    fontSize: 11.5,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#6b6b6b #2b2b2b',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: '#2b2b2b',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 15,
            backgroundColor: '#6b6b6b',
            minHeight: 24,
            border: '3px solid #2b2b2b',
          },
          '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
            backgroundColor: '#959595',
          },
          '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
            backgroundColor: '#959595',
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#959595',
          },
          '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
            backgroundColor: '#2b2b2b',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label': {
            color: '#3E68A8',
          },
          '& label.Mui-focused': {
            color: '#3E68A8',
          },
          '& .MuiInput-underline:before': {
            borderBottom: 'none',
          },
          '& .MuiInput-underline:hover': {
            borderBottomColor: '#99f6e4',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#38bdf8',
          },
          '&. Mui-error:after': {
            borderBottomColor: '#fda4af',
          },

          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#5eead4',
            },
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiAutocomplete-clearIndicator': {
            color: '#38bdf8',
          },
          '& .MuiAutocomplete-popupIndicator': {
            color: '#38bdf8',
          },
        },
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '0.7rem',
          marginLeft: 10,
          '&.Mui-error': {
            color: '#f87171',
          },
        },
      },
    },
  },
})
