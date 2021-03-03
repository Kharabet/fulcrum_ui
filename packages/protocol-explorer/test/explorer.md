# Protocol explorer QA

Protocol explorer includes four pages for testing: stats page, liquidations page, result page and token page.

The UI should show tabs to switch pages from "stats" and "liquidations".

## The stats page should show:

- TVL chart
- search section should:
  - for testing search section can use this address: _0x02535f81854b731a185a765286f7196c6c2b63a4_
  - check hash transaction or user address
  - redirect to result page
  - show table of result
- list of token cards
  - **Token card** should be clickable
  - redirect to token page and open full information about this token

## The liquidations page should show:

- liquidations chart bar, that shows activity last 30 days
- search section
- table of last liquidation transaction
  - if the table has items of more than 10, UI should have pagination
- pie chart of unhealthy loans
- table of unhealthy loans includes fields such as: **Loan ID**, **Amount to Pay Off**, **Collateral to Receive** and **Action** (liquidation button)
  - action opens form, that lets to liquidate unhealthy loan
  - if unhealthy loan is liquidated successfully, liquidations page should will be updated
- table of rollovers includes fields such as: **Loan ID**, **Rollover Rebate to Recive** and **Action**
  - if the table has items of more than 10, UI should have pagination
  - if rollovers is liquidated successfully, liquidations page should will be updated

## The token page should show:

- chart of TVL, utilization and supply APR of token
- search section
- table of last transactions
  - if the table has items of more than 10, UI should have pagination

## The result page should show:

- search section
- table of result includes fields such as: **Txn Hash**, **Age** **From**, **Quantity** and **Action**
  - **Age** should be clickable and sort table by age
