pragma solidity >=0.7.0 <0.9.0;

import "./ERC20/IERC20.sol";

contract Exchange {

    constructor() {
        vaultsCount = 0;
    }

    struct Offer {
        address _from;
        address _from_token;
        uint256 _from_count;
        address _to;
        address _to_token;
        uint256 _to_count;
    }

    uint256 public vaultsCount;
    mapping(uint256 => Offer) public vaults;

    function createVault(address from, address from_token, uint256 from_count, address to, address to_token, uint256 to_count) public returns(uint256) {
        vaultsCount++;

        vaults[vaultsCount]._from = from;
        vaults[vaultsCount]._from_token = from_token;
        vaults[vaultsCount]._from_count = from_count;
        vaults[vaultsCount]._to = to;
        vaults[vaultsCount]._to_token = to_token;
        vaults[vaultsCount]._to_count = to_count;

        return vaultsCount;
    }

    function getVault(uint256 vaultId) public view returns (address) {
        return vaults[vaultId]._from;
    }

    function swapTokens(uint256 vaultId) public  {
        Offer memory offer = vaults[vaultId];

        IERC20 token1 = IERC20(offer._from_token);
        IERC20 token2 = IERC20(offer._to_token);
        token2.transferFrom(offer._from, offer._to, offer._from_count);
        token1.transferFrom(offer._to, offer._from, offer._to_count);

    }
}