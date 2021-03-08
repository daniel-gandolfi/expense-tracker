import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Toolbar,
  Typography,
  AppBar,
  makeStyles,
  MenuItem,
  Menu
} from '@material-ui/core';
import { usePromiseSafe } from 'ui/hooks/usePromiseSafe';
import { transactionService } from 'services/transaction/PouchOrmTransactionService';
import { formatMoneyLocal } from 'ui/utils/formatting';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { MONTH_BALANCE_ROUTE } from 'ui/utils/routes';
import { useRouteMatch } from 'react-router-dom';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(navigator.language || 'it_IT', {
    month: 'long',
    year: 'numeric'
  }).format(date);
}

type HeaderProps = {
  month: number;
  year: number;
};
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
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const [totalBalance, setTotalBalance] = useState<number>(0);
  // eslint-disable-next-line no-console
  usePromiseSafe(transactionService.getTotalBalance(), setTotalBalance, (x) => console.log(x));
  const routeMatch = useRouteMatch<{ monthParam: string; yearParam: string }>(MONTH_BALANCE_ROUTE);
  const title = formatDate(
    routeMatch ? new Date(+routeMatch.params.yearParam, +routeMatch.params.monthParam) : new Date()
  );
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <Menu open={isMenuOpen} onClick={() => setMenuOpen(!isMenuOpen)}>
            <MenuItem></MenuItem>
          </Menu>
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>
        <Button color="inherit">
          {formatMoneyLocal(totalBalance / 100)}
          <EqualizerIcon aria-label={'Stats'} />
        </Button>
      </Toolbar>
    </AppBar>
  );
}
