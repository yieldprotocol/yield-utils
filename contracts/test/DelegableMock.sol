// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.6.10;

import "../access/Delegable.sol";


contract DelegableMock is Delegable {
    function restricted(address account)
        public view
        onlyHolderOrDelegate(account, "DelegableMock: Forbidden")
        returns (bool)
    {
        return true;
    }
}
