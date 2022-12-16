import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'

interface TryAgainProps {
    onClick(): void
}

export default function TryAgain(props: TryAgainProps) {
  return (
    <Box display="flex" justifyContent="center" height="100vh" alignItems="center">
        <Button variant="outlined" onClick={props.onClick}>Try again</Button>
    </Box>
  );
}