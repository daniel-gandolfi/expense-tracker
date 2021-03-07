import Swipe from 'react-easy-swipe';
import { MonthPreview } from 'ui/components/MonthPreview/MonthPreview';
import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {createMonthBalanceRoute} from "ui/utils/routes";

export function MonthBalance() {
  const history = useHistory();
  const { month, year } = useParams<{month:string, year:string}>();
  const yearNumber = year ? +year : new Date().getFullYear();
  const monthNumber= month ? +month : new Date().getMonth();

  function onSwipeRight() {
    const newMonth = monthNumber !== 0 ? monthNumber - 1 : 11;
    const newYear = newMonth !== 11 ? yearNumber : yearNumber - 1;
    history.push(createMonthBalanceRoute(newYear, newMonth));
  }

  function onSwipeLeft() {
    const newMonth = monthNumber !== 11 ? monthNumber + 1 : 0;
    const newYear = newMonth !== 0 ? yearNumber : yearNumber + 1;
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
      <MonthPreview month={monthNumber} year={yearNumber} />
    </Swipe>
  );
}
