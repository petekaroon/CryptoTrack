import React, { useState } from 'react';
import ToggleButton from '@material-ui/core/ToggleButton';
import ToggleButtonGroup from '@material-ui/core/ToggleButtonGroup';

export default function BuySellToggle() {
  const [alignment, setAlignment] = React.useState('buy');

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  return (
    <ToggleButtonGroup fullWidth size="small" color="primary" value={alignment} exclusive onChange={handleChange}>
      <ToggleButton value="buy">Buy</ToggleButton>
      <ToggleButton value="sell">Sell</ToggleButton>
    </ToggleButtonGroup>
  );
}
