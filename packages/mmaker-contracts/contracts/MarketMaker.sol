/**
 * Copyright 2017-2019, bZeroX, LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0.
 */

pragma solidity 0.5.8;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract LockContract {
    string public symbol;
    address public originalToken;

    function deposit(uint _value, uint _forTime) public returns (bool success);
    function transfer(address _to, uint256 _value) public returns (bool);
    function transferFrom(address _from, address _to, uint _value) public;
    function burn(address _from, uint _value) public;
    function addBzxMarketMaker(address _marketMaker) public;
}

contract PositionToken is IERC20 {
    function mintWithEther(address receiver, uint256 maxPriceAllowed) external payable returns (uint256);
    function burnToEther(address payable receiver, uint256 burnAmount, uint256 minPriceAllowed) external returns (uint256);
}

contract MarketMaker is Ownable {

    mapping(string => address) internal lockContractBySymbol;

    event LockContractSet(string symbol, address lc);

    constructor(address[] memory addresses) public {
        setLockContracts(addresses);
    }

    function mint(
        string calldata symbol,
        uint256 maxPriceAllowed,
        uint forTime
    )
        external
        payable
        returns (uint256)
    {
        address lc = lockContractBySymbol[symbol];
        require(lc != address(0));

        require(forTime >= 1);

        LockContract lockContract = LockContract(lc);
        PositionToken pToken = PositionToken(lockContract.originalToken());

        uint256 mintAmount = pToken.mintWithEther.value(msg.value)(address(this), maxPriceAllowed);

        pToken.approve(lc, mintAmount);
        require(lockContract.deposit(mintAmount, forTime), "deposit failed");
        require(lockContract.transfer(msg.sender, mintAmount), "transfer failed");

        return mintAmount;
    }

    function burn(
        string calldata symbol,
        uint value,
        uint256 minPriceAllowed
    )
        external
    {
        address lc = lockContractBySymbol[symbol];
        require(lc != address(0));

        LockContract lockContract = LockContract(lc);
        lockContract.burn(msg.sender, value);

        PositionToken pToken = PositionToken(lockContract.originalToken());
        pToken.burnToEther(msg.sender, value, minPriceAllowed);
    }

    function setLockContract(address lc) public onlyOwner {
        LockContract lockContract = LockContract(lc);
        lockContract.addBzxMarketMaker(address(this));
        lockContractBySymbol[lockContract.symbol()] = lc;
        emit LockContractSet(lockContract.symbol(), lc);
    }

    function setLockContracts(address[] memory addresses) public onlyOwner {
        for (uint i = 0; i < addresses.length; i++) {
            setLockContract(addresses[i]);
        }
    }
}
