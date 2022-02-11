const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
const contractAddress = "0x25894Dd664e1A7051c0Bb8440543a241984c73a8";
let signer = undefined;
let contract = undefined;
const contractAbi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_player",
          "type": "address"
        }
      ],
      "name": "attackPlayer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_hoursCooldown",
          "type": "uint256"
        }
      ],
      "name": "changeCooldownHours",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "createPlayer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "trainAttack",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "trainDefense",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "trainMagic",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "viewCooldown",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_playerAddress",
          "type": "address"
        }
      ],
      "name": "viewPlayer",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint64",
          "name": "health",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "attack",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "defense",
          "type": "uint64"
        },
        {
          "internalType": "uint64",
          "name": "magic",
          "type": "uint64"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

async function connectMetamask() {
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractAbi, provider);
}

async function createPlayer(name) {
    if (signer == undefined) await connectMetamask();
    if (name == "") return;
    const contractWithSigner = contract.connect(signer);

    let tx = await contractWithSigner.createPlayer(name);
    console.log(tx);
    
}

async function getPlayer() {
    if (signer == undefined) await connectMetamask();
    let myAddress = await signer.getAddress()
    let statistics = await contract.viewPlayer(myAddress);
    document.getElementById("player-name").innerText = statistics.name;
    document.getElementById("player-health").innerText = statistics.health.toNumber();
    document.getElementById("player-attack").innerText = statistics.attack.toNumber();
    document.getElementById("player-defense").innerText = statistics.defense.toNumber();
    document.getElementById("player-magic").innerText = statistics.magic.toNumber();
}

async function getOtherPlayer(address) {
    if (signer == undefined) await connectMetamask();
    let statistics = await contract.viewPlayer(address);
    document.getElementById("other-player-name").innerText = statistics.name;
    document.getElementById("other-player-health").innerText = statistics.health.toNumber();
    document.getElementById("other-player-attack").innerText = statistics.attack.toNumber();
    document.getElementById("other-player-defense").innerText = statistics.defense.toNumber();
    document.getElementById("other-player-magic").innerText = statistics.magic.toNumber();
}

async function attackPlayer(address){
    if (signer == undefined) await connectMetamask();
    if (address == "") return;
    const contractWithSigner = contract.connect(signer);

    let tx = contractWithSigner.attackPlayer(address);
}

async function trainAttack() {
    if (signer == undefined) await connectMetamask();
    const contractWithSigner = contract.connect(signer);

    let tx = contractWithSigner.trainAttack();
}

async function trainDefense() {
    if (signer == undefined) await connectMetamask();
    const contractWithSigner = contract.connect(signer);

    let tx = contractWithSigner.trainDefense();
}

async function trainMagic() {
    if (signer == undefined) await connectMetamask();
    const contractWithSigner = contract.connect(signer);

    let tx = contractWithSigner.trainMagic();
}

async function changeCooldown(hours){
    if (signer == undefined) await connectMetamask();
    const contractWithSigner = contract.connect(signer);

    let tx = contractWithSigner.changeCooldownHours(hours);
}
