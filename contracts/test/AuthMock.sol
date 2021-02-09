// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "../access/Auth.sol";


contract AuthMock is Auth {
    function restricted(address account)
        public view
        checkAuth(account, "DelegableMock: Forbidden")
        returns (bool)
    {
        return true;
    }
}
