# Fulcrum QA

The main features of the fulcrum and how they are expected to work.



## Lend Page

Supported assets for lending: 
- ETH
- DAI
- USDC
- USDT
- WBTC
- LINK
- YFI
- BZRX
- MKR
- KNC
- UNI
- AAVE
- LRC
- COMP

The above list is dynamic and depends on various product-level factors. Also in the future it should support dynamic tokens from permisionless listing 

On the Lend page UI should show tiles - one per each asset. Each tile has 2 states: active and inactive. 

The tile is in "inactive" state when user hasn't related iToken (i.e. iETH for ETH tile) in their wallet (`iToken.assetBalanceOf(account)` returns zero). The tile shoud show interest APR%, liquidity in token denomination and "Lend" button

The tile is in "active" state when user has some iTokens in their wallet (`iToken.assetBalanceOf(account)` returns non-zero). In this case tile should show user's `iToken.assetBalanceOf(account)` as "balance" and  `iToken.profitOf(account)` as "profit" that also should be incremented each second to show estimated realtime profit according to the APR%.
The tile should has "Lend" and "Unlend" buttons.

On wallet changing (or inner metamask accounts changing), network changing all tiles should be refreshed with the up-to-date data for the newly selected account or network.

### Lend Form

This for is the same for both lend and unlend actions.
The form contains basic info for lending/unlending: Interest APR% and corresponding iTokens amount that user will receive in the result of lend. Also there should be a notification if token isn't approved yet, so user is aware that he should do two txns: 1st for approve, 2nd for lend itself.  



## Trade Page

The page contains pairs selector and following tabs: "Chart", "Open Positions", "Trade History", "Stats"  

### Chart Tab

This view is visible when user clicked on "Chart" tab or selected some pair in pairs selector. 

Tradigview Chart should show candle chart for selected pair. 
The table below (`TradeTokenGrid`) should consist of two rows (`TradeTokenGridRow`): first for longs, second for shorts. For Each row there are should be leverage selector, mid. market price (we take it from Kyber, not Chainlink oracle because this price the most accurate to real open price in the result of trade), estimated liq. price, interest APR and a button that opens `TradeForm`.  
Each of these rows should render user's positions (`InnerOwnTokenGridRow`) if they exist for the selected pair. 
`InnerOwnTokenGridRow` should display (ETH/USDC pair as example):
- Position - always in base token denomination (ETH)
- Value - always in quote token denomination (USDC) - show the "Position" * "Mid. Market Price". Under this value, percentage profit should be shown that indicates percentage difference between current price position value and open price position value. This percent is color coded - negative value shloud be red, positive - should be green.  
- Collateral - for longs in ETH, for shorts in USDC - show user's `depositValueAsCollateral` or `depositValueAsLoan`. Under this value, collaterization percent should be shown (if collaterization is too low (10% left to maintenance margin) - it has red color). Also there are two small icon-buttons: manage collateral and front interest that open corresponding modal forms (`ManageCollateralForm` and `ExtendLoanForm`).
- Open Price -  always in quote denomination (USDC).
- Liq. price -  always in quote denomination (USDC).
- Profit -  shown in both base and quote token denominations (ETH/USDC). In short profit is calculated as estimated withdraw amount in the result of 100% position closing minus `depositValueAsCollateral` (for collateral token profit) or `depositValueAsLoan` (for loan token profit). Profit is color coded - negative value shloud be red, positive - should be green. If `closeWithSwap` throws an error or return zero, "-" (dash) is shown as profit.
- Sell button that opens `TradeForm` for close or Rollover button that does rollover if position was expired.


### Manage Positions Tab

Purpose of this tab is to show all positions from all pairs that user has. It consist of list of `OwnTokenGridRow` that are very similar to `InnerOwnTokenGridRow` described above. Each row consist of following columns:
- Pair - pair name in `<base token>/<quote token>` format
- Position - position value with small `<base token> <leverage>x <LONG|SHORT>` header
- Open Price - swap rate (`entryPrice` field) from `Trade` event for this position with `<quote token>` header.
- Current Price - current swap rate from Kyber in quote token denomination.
- Liq. Price - liquidation price that os calculated based on loan's maintenance margin, principal and collateral token amount by the following formula: `((maintenance_margin * principal / 10^20) + principal) / collateral * 10^18` for Longs and `10^36 / ((maintenance_margin * principal / 10^20) + principal) / collateral * 10^18` for Shorts. Should be shown in quote token denomination.
- Colalteral - for longs in baseToken, for shorts in USDC - show user's `depositValueAsCollateral` or `depositValueAsLoan`. Under this value, collaterization percent should be shown (if collaterization is too low (10% left to maintenance margin) - it has red color). Also there are two small icon-buttons: manage collateral and front interest that open corresponding modal forms.
- Position value - always in quote token denomination (USDC) - show the "Position" * "Mid. Market Price". 
- Profit -  shown in both base and quote token denominations (ETH/USDC). In short profit is calculated as estimated withdraw amount in the result of 100% position closing minus `depositValueAsCollateral` (for collateral token profit) or `depositValueAsLoan` (for loan token profit). Profit is color coded - negative value shloud be red, positive - should be green. If `closeWithSwap` throws an error or return zero, "-" (dash) is shown as profit.
- Sell button that opens `TradeForm` for close or Rollover button that does rollover if position was expired (`endTimestamp > current date` or `interestDepositRemaining === 0`).


### Trade Form

Trade form could be either BUY or SELL depending on user's action (whether they clicked BUY or SELL button before).

BUY:
Buy form has deposit input, slider with Max button, block with Entry Price, Li. Price, Fees (overestimated), and fee savings using CHI with CHI switch. In the bottom there is submit buttton that shows estimated position value with leverage. 
By default there is "Max" option is triggered on form initialization as a "pre-set".
For the BUY Trade form there are two scenarios: to deposit base token or quote token (there is a switch for that in deposit input)

SELL:
Sell form has "position-amount-to-close" input with the slider below it. Slider has "Max" button (form is initalized with this "Max" option being activated). The second input indicates how many tokens user will receive in their wallet (wothdraw amount). Below there are estimated Fees $ value and estimated savings in case of CHI usage with. In the bottom ther is submit form that shows the position amount being closed.    
For the SELL Trade form there are two scenarios as well: user could withdraw base token or quote token (three is also a switch that allows to choose desired withdraw token)


### Manage Collateral Form

It could be opened by clicking on pencil icon near the "Collateral" value on the opened position row. In default state it shows current collaterization percent. By sliding the slider or entering value in the input user is able to set new collaterization percent. Depends on their new colalterization percent, they will deposit or withdraw some collateral amount. For example if there was initially 50% and user slided to 75%, they should deposit some more collateral tokens, but if they slided to 35%, they should receive some redunant collateral tokens to their address.


### Front Interest Form

The form could be opened by clicking on "refresh" icon button on the position's row (`InnerOwnTokenGridRow` or `OwnTokenGridRow`).
By default position duration is 28 days, if user want they could front interest by submitting Front interest form. 
In the form there is input and slider (two ways to input desired amount of principal). Depending this value, new position's expiration date is calculated and shown in the top part of the form. In the bottom there is submit button.


### Trade History Tab

This tab contains txns history table (`HistoryTokenGrid`) where each row displays position's lifecycle (events). The row is collapsible. When it is in closed state it shows the latest event, when it is in opened state it shows all previous position's events.
Each event has it owns row. In general the row consist of following columns:
- Date: the timestamp of corresponding txn (it is a link to etherscan actually)
- Pair name (if in collapsed state)   
- Position type and leverage (if in collapsed state)   
- Event name (if in opened state)
- Position: position amount being affected by the event
- Trade Price: token rate at that moment
- Value: position amount in quote token denomination
- Fee/Rewards: fee (in loan token denomination) and rewards (in BZRX denomination)
- Profit
- Last Event: name of the latest event for the position (if in collapsed state) 

Some events doesn't have info for the above listed fields (no trading fees, or profit). In that case "-" (dash) is shown in corresponding column. 

Following events are tracked in this table: 
- Trade (position opening)
- CloseWithSwap (position closing)
- Liquidation (position liquidation)
- DepositCollateral (increasing collaterization percentage)
- WithdrawCollateral (increasing collaterization percentage)
- Rollover


### Stats Tab

Stats tab contains table(`StatTokenGrid`) that shows key metrics for each pool of iTokens. The row per iToken with following columns:
- Reserve: logo with token name
- TVL (USD): `TVL * current $price`
- Total Supply (USD): `Total Supply * current $price`
- Total Supply: `iToken.totalAssetSupply`
- Total Borrowed: `iToken.totalAssetBorrow`
- Vault Locked: the same as TVL. It includes locked assets in bZx contract and locked assets in staking contract. From Staking contract vBZRX is counted as BZRX with vested multiplier (`1 vBZRX = (1 - vBZRX.totalVested() / vBZRX.totalSupply()) BZRX`); BTP pool consist of WETH part and BZRX part, so locked BPT is spreaded to ETH and BZRX parts and counted in this table as well.  
- Total Available: amount of liquidity in the pool (`iToken.marketLiquidity`)
- Supply Rate (APR): `iToken.supplyInterestRate`
- Borrow Rate (APR): `iToken.nextBorrowInterestRateWithOption`
The last row in table is a summary of all assets' TVL (USD) and Total Supply (USD)

All above iToken calls are aggregated in `DappHelper` contract, so we can just call it once and get all desired data for the set of tokens.


## Other

### Approvals
In most cases we set infinite approval (`2^256 - 1`) by default .
There are two ways to set/update token approval:
- Call `approve` method with new params. This works for most tokens
- Call `approve` with zero (reset approval) and then call `approve` method with new desired amount. There are a couple of our supported tokens that should be approved in this way: USDT and KNC


