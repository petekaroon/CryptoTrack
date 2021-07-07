import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import Modal from '@material-ui/core/Modal';
import editFill from '@iconify/icons-eva/edit-fill';
import { makeStyles } from '@material-ui/core/styles';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
// Components
import AddTransactionModal from './AddTransactionModal';
// api
import { deleteTransaction } from '../../api/Main';

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

TransactionMoreMenu.propTypes = {
  cryptoId: PropTypes.number,
  cryptoName: PropTypes.string,
  cryptoSymbol: PropTypes.string,
  transactionId: PropTypes.number,
  handleSetLastUpdate: PropTypes.func,
  currentTransaction: PropTypes.object
};

export default function TransactionMoreMenu(props) {
  const ref = useRef(null);
  const classes = useStyles();

  const { cryptoId, cryptoName, cryptoSymbol, transactionId, handleSetLastUpdate, currentTransaction } = props;

  const [modalStyle] = useState(getModalStyle);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleOpen = () => {
    setModalIsOpen(true);
  };

  const handleClose = () => {
    setMenuIsOpen(false);
    setModalIsOpen(false);
  };

  const handleCancel = () => {
    setMenuIsOpen(false);
    setModalIsOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deleteTransaction(transactionId);
      handleSetLastUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setMenuIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={menuIsOpen}
        anchorEl={ref.current}
        onClose={() => setMenuIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <div>
          <MenuItem onClick={handleOpen}>
            <ListItemIcon>
              <Icon icon={editFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={modalIsOpen}
            onClose={handleClose}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <div style={modalStyle} className={classes.paper}>
              <AddTransactionModal
                cryptoId={cryptoId}
                cryptoName={cryptoName}
                cryptoSymbol={cryptoSymbol}
                handleSetLastUpdate={handleSetLastUpdate}
                onClose={handleClose}
                onCancel={handleCancel}
                isEdit
                currentTransaction={currentTransaction}
              />
            </div>
          </Modal>
        </div>

        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
