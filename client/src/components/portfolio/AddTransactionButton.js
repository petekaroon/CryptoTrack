import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
// Components
import AddTransactionModal from './AddTransactionModal';

// ----------------------------------------------------------------------

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    position: 'absolute',
    width: 480,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: 16
  }
}));

// ----------------------------------------------------------------------

AddTransactionButton.propTypes = {
  supportedCryptos: PropTypes.array,
  handleSetLastUpdate: PropTypes.func
};

export default function AddTransactionButton(props) {
  const { supportedCryptos, handleSetLastUpdate } = props;
  const now = new Date();

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button fullWidth size="large" variant="contained" onClick={handleOpen}>
        + Add Transaction
      </Button>

      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
        style={{ alignItems: 'center', justifyContent: 'center' }}
      >
        <div style={modalStyle} className={classes.paper}>
          <AddTransactionModal
            supportedCryptos={supportedCryptos}
            handleSetLastUpdate={handleSetLastUpdate}
            onClose={handleClose}
            onCancel={handleCancel}
            now={now}
          />
        </div>
      </Modal>
    </div>
  );
}
