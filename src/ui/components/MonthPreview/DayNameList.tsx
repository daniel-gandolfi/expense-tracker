import { GridList, GridListTile, Typography } from '@material-ui/core';
import React, { useMemo } from 'react';
import { dayNameExtendedFormatter } from 'ui/components/MonthPreview/common';

type DayNameListProps = {
  year: number;
  month: number;
};
export function DayNameList({ year, month }: DayNameListProps) {
  const firstSevenDaysNames = useMemo(
    () =>
      [1, 2, 3, 4, 5, 6, 7]
        .map((day) => dayNameExtendedFormatter.format(new Date(year, month, day)))
        .map((dayName) => (
          <GridListTile key={dayName} cols={1}>
            <Typography variant="h6" component="h4">
              {dayName}
            </Typography>
          </GridListTile>
        )),
    [year, month]
  );
  return (
    <GridList cellHeight={50} cols={7}>
      {firstSevenDaysNames}
    </GridList>
  );
}
