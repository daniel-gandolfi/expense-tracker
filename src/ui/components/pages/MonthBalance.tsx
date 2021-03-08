import Swipe from 'react-easy-swipe';
import { MonthPreview } from 'ui/components/MonthPreview/MonthPreview';
import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { createMonthBalanceRoute } from 'ui/utils/routes';

export function MonthBalance() {
  const history = useHistory();
  const { monthParam, yearParam } = useParams<{ monthParam: string; yearParam: string }>();
  const year = yearParam ? +yearParam : new Date().getFullYear();
  const month = monthParam ? +monthParam : new Date().getMonth();

  function onSwipeRight() {
    const newMonth = month !== 0 ? month - 1 : 11;
    const newYear = newMonth !== 11 ? year : year - 1;
    history.push(createMonthBalanceRoute(newYear, newMonth));
  }

  function onSwipeLeft() {
    const newMonth = month !== 11 ? month + 1 : 0;
    const newYear = newMonth !== 0 ? year : year + 1;
    history.push(createMonthBalanceRoute(newYear, newMonth));
  }
  return (
    <Swipe
      allowMouseEvents={true}
      tolerance={60}
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      innerRef={(x) => {
        x;
      }}>
      <MonthPreview month={month} year={year} />
    </Swipe>
  );
}
