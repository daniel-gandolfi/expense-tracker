export const MONTH_BALANCE_ROUTE = '/balance/:yearParam/:monthParam';
export function createMonthBalanceRoute(year: number, month: number) {
  return MONTH_BALANCE_ROUTE.replace(':yearParam', year.toString()).replace(
    ':monthParam',
    month.toString()
  );
}
export const DAY_BALANCE_ROUTE = '/balance/:yearParam/:monthParam/:dayParam';
export function createDayBalanceRoute(year: number, month: number, day: number) {
  return MONTH_BALANCE_ROUTE.replace(':yearParam', year.toString())
    .replace(':monthParam', month.toString())
    .replace(':dayParam', day.toString());
}

export const IMPORT_ROUTE = '/import';
