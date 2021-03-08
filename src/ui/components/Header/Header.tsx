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
import { IMPORT_ROUTE, MONTH_BALANCE_ROUTE } from 'ui/utils/routes';
import { useRouteMatch, NavLink } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(navigator.language || 'it_IT', {
    month: 'long',
    year: 'numeric'
  }).format(date);
}

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
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  const [totalBalance, setTotalBalance] = useState<number>(0);
  // eslint-disable-next-line no-console
  usePromiseSafe(transactionService.getTotalBalance(), setTotalBalance, (x) => console.log(x));
  const routeMatch = useRouteMatch<{ monthParam: string; yearParam: string }>(MONTH_BALANCE_ROUTE);
  const title = formatDate(
    routeMatch ? new Date(+routeMatch.params.yearParam, +routeMatch.params.monthParam) : new Date()
  );
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon ref={setAnchorEl} onClick={toggleMenu} />
          <Menu
            open={isMenuOpen}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            keepMounted
            transformOrigin={{
              vertical: -40,
              horizontal: 'left'
            }}
            onClick={toggleMenu}>
            <MenuItem>
              <NavLink to={IMPORT_ROUTE}>Import Data</NavLink>
            </MenuItem>
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
