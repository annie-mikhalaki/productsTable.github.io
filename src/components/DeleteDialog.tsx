import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';

interface DeleteDialogProps {
  open: boolean,
  selectedProductNames: string[],
  onCancel(): void,
  onContinue(): void
}

export default function DeleteDialog(props: DeleteDialogProps) {
  return (
      <Dialog
        open={props.open}
        onClose={props.onCancel}
      >
        <DialogTitle>
         Подтвердите действие
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography>Вы уверены что хотите аннулировать товар(ы):</Typography>
            <Typography>{props.selectedProductNames.join(', ')}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel}>Отклонить</Button>
          <Button onClick={props.onContinue} autoFocus>Применить</Button>
        </DialogActions>
      </Dialog>
  );
}