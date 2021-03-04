# Torque QA

The main features of the torque and how they are expected to work.

The tokens related to torque: ETH, DAI, USDC, USDT, WBTC, LINK, YFI, BZRX, MKR, KNC, UNI, AAVE, LRC, COMP.

## Sections: "Borrow" & "Your loans"

The UI should show tabs to switch sections from "borrow" and "your loans".

## Torque: Borrow

- The UI should show all token cards with the possibility to do borrow
  - user can see fixed interest rate and available liquidity
  - **Token card** should be clickable

## Torque: Your loans

There are all user loans

## Torque: each loan should show:

* Section with information about loan
  - Token info with borrowed position, fixed interest rate
  - The user is shown visual information about collateralization. There is also a red/green loan safety indicator. 
  - Current liquidation price. User can click to toggle quote currency.

* 4 types of actions
  - Manage Collateral if need too **top up** or **withdraw** collateralization 
  - Front Interest if loan is required to front more interest payments, this will come from collateral. User can to do rollover for overdue loans
  - The user can repay the loan in full or in part
  - If the user have enough collateralization, he can borrow more 
      
## Forms

There are 5 types of forms:

1. Borrow form
2. Manage Collateral form
3. Front Interest form
4. Repay Loan form
5. Borrow more form

### 1. Borrow form

 * Left side
 
  - User can see token info, fixed interest rate and available liquidity

 * Right side

    - There should be as many input (field + slider) as how much tokens user can to borrow or deposit
    - The user can borrow max available currency which is possible with his/her wallet   
    - Ability to change deposit token 
    - The user moves the slider to change the provisioning percentage. In addition, the slider changes the cost of borrowing, while the deposit remains unchanged  
    - Expected results block consists from:
        - Collateralization percent
        - Expected Gas fee in USD
        - Expected liquidation price. User can click to toggle quote currency.
        - User can use CHI token to save on gas fees.  Also shows expected saved amount in USD
        - Tooltips with explanation and links to useful information
    - Submit button
    - Close form button

### 2. Manage Collateral form

- There should be as many input (field + slider) if need to **top up** or **withdraw** collateralization amount
- Expected liquidation price. User can click to toggle quote currency.
- Submit button
- Close form button

### 3. Front Interest form

- Displays loan end date
- There should be as many input (field + slider + buttons) if loan is required to front more interest payments.
- Expected liquidation price. User can click to toggle quote currency.
- Submit button
- Close form button

### 4. Repay Loan form

- There should be as many input (field + buttons) if the user wants to repay the loan in full or in part.
- User can use CHI token to save on gas fees. 
- Submit button
- Close form button

### 5. Borrow more form

- User can input how much tokens he/she can to borrow more for given collateralization
- Shown visual information about collateralization. There is also a red/green loan safety indicator. 
- Submit button
- Close form button
