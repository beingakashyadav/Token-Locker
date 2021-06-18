// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "./ERC20/IERC20.sol";
import "./SafeMath.sol";
pragma experimental ABIEncoderV2;

contract Locker {
    using SafeMath for uint256;

    struct ReleaseCheckpoint {
        uint256 tokensCount;
        uint256 releaseTargetTimestamp;
        bool claimed;
    }

    struct VestedTokenVault {
        address tokenAddress;
        ReleaseCheckpoint[] checkpoints;
    }

    struct UserLocks {
        VestedTokenVault[] userVaults;
    }

    //every user has multiple vaults: he can store any token with different release schedules. 
    //Token might be duplicated, e.g. Vault1: USDC with 6 months lock + Vault2: USDC with 12 months lock
    mapping(address => UserLocks) userLocks;

    function lock(
        uint256 targetTimestamp,
        address tokenContract,
        uint256 tokenCount
    ) public returns (uint256) {
        require(targetTimestamp > block.timestamp, "Date in the past selected");
        require(tokenCount > 0, "Token count must be positive number");
        require(tokenContract != address(0), "Token contract is null");

        //push new element to user's vault and get it's index
        userLocks[msg.sender].userVaults.push();
        uint vaultIndex = userLocks[msg.sender].userVaults.length - 1;

        //create release checkpoint to created vault 
        userLocks[msg.sender].userVaults[vaultIndex].checkpoints.push();

        //get created user Vault by index
        VestedTokenVault storage targetVault = userLocks[msg.sender].userVaults[vaultIndex];
        //uint checkpointsIndex = targetVault.checkpoints.length - 1;

        //get checkpoint, in this this case here will be only one element
        ReleaseCheckpoint storage checkpoint = targetVault.checkpoints[0];
        
        //fill input data   
        targetVault.tokenAddress = tokenContract;
        checkpoint.tokensCount = tokenCount;
        checkpoint.releaseTargetTimestamp = targetTimestamp;
        checkpoint.claimed = false;

        //transfer token to vault
        try IERC20(tokenContract).transferFrom(msg.sender, address(this), tokenCount) returns (bool) {
            return vaultIndex;
        } catch (bytes memory) {
            revert("Not an ERC20 token");
        }
    }

    function lockWithLinearRelease(
        uint256 targetBlockRelease,
        address tokenContract,
        uint256 tokenCount,
        int16 checkpoints
    ) public {}

    function lockWithScheduledRelease(
        address tokenContract,
        bytes32[] memory checkpoints
    ) public {}

    function claimAll() public {}

    function claimToken(address token) public {}

    function claimByVaultId(uint vaultId) public returns (bool) {
        require(vaultId >= 0, "vaultId should be positive");

        VestedTokenVault storage vault = userLocks[msg.sender].userVaults[vaultId];
        ReleaseCheckpoint storage checkpoint = vault.checkpoints[0];

        require(checkpoint.claimed == false, "Already claimed");
        require(checkpoint.releaseTargetTimestamp <= block.timestamp, "Cannot claim before target date");
        
        try 
            IERC20(vault.tokenAddress).transfer(msg.sender, checkpoint.tokensCount)
        returns (bool) {
            checkpoint.claimed = true;
            return true;
        } catch (bytes memory) {
            revert("Transfer error");
        }
    }

    function getUserVaults(address userAddress)
        public
        view
        returns (UserLocks memory)
    {
        return userLocks[userAddress];
    }
}
