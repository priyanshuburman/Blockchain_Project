// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

contract Transaction {
    address berthingShip = 0x927e3C660c979554406f8FcE9c6312A6AC3198E3;
    address cloudServer = 0x64c975b1df36A1fE27738069AC2467487C05aCe1;
    address smartDevice = 0xfBd4cC151d20242934baf18e5f143A3f73713679;

    function getRandomNumber(uint seed) internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender, seed)));
    }

    event BStoCS (uint256 BS1, uint256 Ibs, uint256 STbs);
    event CStoBS (uint256 CS1, uint256 Ics, uint256 STcs);
    event BStoSD (uint256 BS3, uint256 BS4, uint256 Ibs, uint256 STbs);
    event SDtoBS (uint256 SD2, uint256 SD3, uint256 Isd, uint256 STsd);

    function BerthingShipToCloudServer () external {

        //uint256 CSpub = getRandomNumber(1);
        uint256 Ibs = getRandomNumber(2);
        uint256 STbs = block.timestamp;
        uint256 BS1 = getRandomNumber(5);

        emit BStoCS( BS1,  Ibs,  STbs);
    } 

    function CloudServerToBerthingShip() external {
        //uint256 BSpub = getRandomNumber(1);
        uint256 Ics = getRandomNumber(2);
        uint256 STcs = block.timestamp;
        uint256 CS1 = getRandomNumber(5);

        emit CStoBS(CS1, Ics, STcs);
    }  

    function BerthingShipToSmartDevice() external {
        uint256 BS3 = getRandomNumber(1);
        uint256 BS4 = getRandomNumber(2);
        uint256 Ibs = getRandomNumber(3);
        uint256 STbs = block.timestamp;

        emit BStoSD(BS3, BS4, Ibs, STbs);
    }

    function SmartDeviceToBerthingShip() external {
        uint256 SD2 = getRandomNumber(1);
        uint256 SD3 = getRandomNumber(2);
        uint256 Isd = getRandomNumber(3);
        uint256 STsd = block.timestamp;

        emit SDtoBS(SD2, SD3, Isd, STsd);
    }

}
