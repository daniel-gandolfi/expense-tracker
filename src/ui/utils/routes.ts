export const MONTH_BALANCE_ROUTE = "/balance/byMonth/:yearParam/:monthParam"
export function createMonthBalanceRoute(year:number, month:number) {
    return MONTH_BALANCE_ROUTE.replace(":yearParam", year.toString())
    .replace(":monthParam", month.toString())
}
