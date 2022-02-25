# Simple battle system app

The front-end was done with JavaScript. It connects to a Smart contract deployed on the Ropsten TestNet (0x25894Dd664e1A7051c0Bb8440543a241984c73a8)

The smart contract was developed and tested using Hardhat.

A live version could be seen at: <https://martinsuarezz.github.io/BasicBlockchainWarriors/>

The contract code is the following:

```solidity
pragma solidity ^0.8.0;

contract SimpleApp {
    struct Player{
        string name;
        uint64 health;
        uint64 attack;
        uint64 defense;
        uint64 magic;
        uint256 lastAction;
    }

    mapping (address => Player) players;
    address owner;
    uint256 cooldown;

    modifier timePassed {
        require(block.timestamp >= players[msg.sender].lastAction + cooldown, "Player in cooldown");
        _;
        players[msg.sender].lastAction = block.timestamp;
    }

    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }

    constructor() {
        owner = msg.sender;
        cooldown = 24 hours;
    }

    function createPlayer(string memory _name) public{
        Player storage player = players[msg.sender];
        require(player.health == 0, "Player already created");
        player.name = _name;
        player.health = 1;
        player.attack = 1;
        player.defense = 1;
        player.magic = 1;
    }

    function trainAttack() public timePassed{
        players[msg.sender].attack += 1;
    }

    function trainDefense() public timePassed{
        players[msg.sender].defense += 1;
    }

    function trainMagic() public timePassed{
        players[msg.sender].magic += 1;
    }

    function viewPlayer(address _playerAddress) public view returns (string memory name, uint64 health,
                                                uint64 attack, uint64 defense, uint64 magic){
        Player memory player = players[_playerAddress];
        require(player.health != 0, "Player not created");
        return (player.name, player.health, player.attack, player.defense, player.magic);
    }

    function viewCooldown() public view returns (uint256){
        return cooldown;
    }

    function random(uint _maxNumber) private view returns(uint){
        return (uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty,  
                msg.sender))) % _maxNumber) + 1;
    }

    function attackPlayer(address _player) public timePassed{
        Player memory attacker = players[msg.sender];
        Player memory defender = players[_player];
        require(attacker.health > 0 && defender.health > 0, "Player does not exist");

        uint damage = random(attacker.attack);
        uint magicDamage = random(attacker.magic);
        if (damage > defender.defense || magicDamage > defender.defense) {
            players[msg.sender].health += 1;
        }
    }

    function changeCooldownHours(uint256 _hoursCooldown) public onlyOwner{
        cooldown = _hoursCooldown * 1 hours;
    }
}
```
