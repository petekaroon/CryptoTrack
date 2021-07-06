import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
// api
import { deleteTransaction } from '../../api/Main';

// ----------------------------------------------------------------------

TransactionMoreMenu.propTypes = {
  transactionId: PropTypes.number,
  handleSetLastUpdate: PropTypes.func
};

export default function TransactionMoreMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { transactionId, handleSetLastUpdate } = props;

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
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
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
