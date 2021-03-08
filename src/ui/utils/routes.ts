export const MONTH_BALANCE_ROUTE = '/balance/:yearParam/:monthParam';
export function createMonthBalanceRoute(year: number, month: number) {
  return MONTH_BALANCE_ROUTE.replace(':yearParam', year.toString()).replace(
    ':monthParam',
    month.toString()
  );
}

export const IMPORT_ROUTE = '/import';
