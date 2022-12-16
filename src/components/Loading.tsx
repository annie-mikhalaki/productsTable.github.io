import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box'

export default function Loading() {
  return (
    <Box display="flex" height="100vh" justifyContent="center" alignItems="center">
        <CircularProgress disableShrink />
    </Box>
  )
}