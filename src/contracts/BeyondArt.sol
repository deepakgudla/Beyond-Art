//SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './ERC721Connector.sol';

contract BeyondArt is ERC721Connector {

    string [] public beyondArt;

    mapping(string => bool) _beyondArtExists;

    function mint(string memory _beyondArt) public {
        require(!_beyondArtExists [_beyondArt], 'error - beyondart already exists');
        beyondArt.push(_beyondArt);
        uint _id = beyondArt.length - 1;
        _mint(msg.sender, _id);
        _beyondArtExists[_beyondArt] = true;
    
    }

    constructor() ERC721Connector('BeyondArt', 'bA') {}
}