import { Link } from 'react-router-dom';
import { createEditTransactionRoute } from 'ui/utils/routes';
import { Fab, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React, { memo } from 'react';

const useStyles = makeStyles((theme) => ({
  addFab: {
    position: 'absolute',
    right: theme.spacing(2),
    bottom: theme.spacing(2)
  }
}));

export const AddTransactionFab = memo(function AddTransactionFab() {
  const classes = useStyles();
  return (
    <Link to={createEditTransactionRoute('')}>
      <Fab className={classes.addFab} color="primary" aria-label="add">
        <AddIcon />
      </Fab>
    </Link>
  );
});
