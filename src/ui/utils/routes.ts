export const MONTH_BALANCE_ROUTE = "/balance/byMonth/:year/:month"
export function createMonthBalanceRoute(year:number, month:number) {
    return MONTH_BALANCE_ROUTE.replace(":year", year.toString())
    .replace(":month", month.toString())
}
