import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { useState } from 'react'
import { Alert, Button } from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { FileUploadStyle } from '@/app/styles/muiStyled'
import FileUpload from 'react-mui-fileuploader'
import { ExtendedFileProps } from 'react-mui-fileuploader/dist/types/index.types'
import { GeoJSON } from '@/types/common/GeojsonTypes'
import Snackbar from '@mui/material/Snackbar'

interface FileUploadModalProps {
  onAddLayer: (newLayer: GeoJSON.FeatureCollection) => void
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ onAddLayer }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [filesToUpload, setFilesToUpload] = useState<ExtendedFileProps[]>()
  const [openAlert, setOpenAlert] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleFilesChange = (files: ExtendedFileProps[]) => {
    setFilesToUpload([...files])
  }

  function readFileAsText(file: ExtendedFileProps) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = event => {
        if (event.target) {
          resolve(event.target.result as string)
        } else {
          reject(new Error('FileReader event target is null'))
        }
      }
      reader.onerror = error => reject(error)
      reader.readAsText(file)
    })
  }

  const handleFileLoad = async () => {
    if (filesToUpload && filesToUpload.length > 0) {
      const file = filesToUpload[0]
      try {
        const fileContent = await readFileAsText(file)
        const jsonContent = JSON.parse(fileContent) as GeoJSON.FeatureCollection

        jsonContent.features = jsonContent.features.filter(
          feature =>
            feature.geometry &&
            (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon'),
        )

        if (jsonContent.features.length > 0) {
          onAddLayer(jsonContent)
          setOpenAlert(true)
        } else {
          setErrorMessage('No polygons or multipolygons found in the file.')
          setOpenAlert(true)
        }
      } catch (error) {
        setErrorMessage('An error occurred while loading the layer.')
        setOpenAlert(true)
      }
    }
  }
  return (
    <div>
      <Button
        className='bg-cyan-900 hover:bg-cyan-800'
        variant='contained'
        size='small'
        onClick={handleOpen}
      >
        <FileUploadIcon className='mr-1'></FileUploadIcon>Import
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={FileUploadStyle}>
          <Typography id='modal-modal-title' variant='h6' component='h2' paddingBottom={2}>
            Upload your dataset
          </Typography>
          <FileUpload
            onFilesChange={handleFilesChange}
            onContextReady={context => {}}
            maxUploadFiles={1}
            header='Drag and Drop'
            allowedExtensions={['json']}
            title='Accepted format: json feature collection(only polygons and multipolygons are supported for now)'
            showPlaceholderImage={false}
            multiFile={false}
            BannerProps={{
              elevation: 0,
              sx: { backgroundColor: '#3f3f46', p: 1 },
              variant: 'outlined',
            }}
          />
          <div className='flex justify-end mt-4'>
            <Button
              onClick={handleFileLoad}
              className='bg-cyan-900 hover:bg-cyan-800'
              variant='contained'
              size='small'
            >
              Load
            </Button>
          </div>
        </Box>
      </Modal>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={(event, reason) => {
          setOpenAlert(false)
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {errorMessage ? (
          <Alert severity='error' sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        ) : (
          <Alert severity='success' sx={{ width: '100%' }}>
            Layer loaded successfully
          </Alert>
        )}
      </Snackbar>
    </div>
  )
}
export default FileUploadModal
