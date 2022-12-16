import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface SearchProducts {
    onSearch(e: any): void
}

export default function Search(props: SearchProducts) {
  return (
    <Box
      sx={{
        width: 500,
        maxWidth: '100%',
        padding: 1
      }}
    >
      <TextField fullWidth label="Поиск" id="search" onChange={props.onSearch} />
    </Box>
  );
}