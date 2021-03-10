import React, { useState } from 'react';
import { Button, IconButton, Toolbar, AppBar, makeStyles } from '@material-ui/core';
import { usePromiseSafe } from 'ui/hooks/usePromiseSafe';
import { transactionDao } from 'dao/TransactionDao';
import { formatMoneyLocal } from 'ui/utils/formatting';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { HeaderTitle } from 'ui/components/Header/HeaderTitle';
import { HeaderMenu } from 'ui/components/Header/HeaderMenu';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

export function Header() {
  const classes = useStyles();

  const [totalBalance, setTotalBalance] = useState<number>(0);
  // eslint-disable-next-line no-console
  usePromiseSafe(transactionDao.getTotalBalance(), setTotalBalance, (x) => console.error(x));
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <HeaderMenu />
        </IconButton>
        <HeaderTitle />
        <Button color="inherit">
          {formatMoneyLocal(totalBalance / 100)}
          <EqualizerIcon aria-label={'Stats'} />
        </Button>
      </Toolbar>
    </AppBar>
  );
}
