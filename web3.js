let web3;
let userAddress = '';
async function init() {
  try {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const chainId = await web3.eth.getChainId();
      if (chainId !== 11155111) {
        await switchToSepolia();
      }
      
      const accounts = await web3.eth.getAccounts();
      userAddress = accounts[0];

    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      throw new Error('Non-Ethereum browser detected.');
    }
    
    // Event listeners
    window.ethereum.on('accountsChanged', accounts => {
      userAddress = accounts[0];
    });
  
    window.ethereum.on('chainChanged', chainId => {
      // Handle the new chain.
      // Time permitting, you could automatically reload the page.
    });

    console.log("Web3 initialized");
  } catch (error) {
    console.error("Initialization failed:", error);
    throw error;
  }
}

async function switchToSepolia() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x11155111' }]
    });
  } catch (error) {
    if (error.code === 4902) {
      console.log('Chain not added');
    }
    console.error(error);
  }
}

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "actualArrivalTime",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "condition",
				"type": "string"
			}
		],
		"name": "confirmArrival",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "feedback",
				"type": "string"
			}
		],
		"name": "giveFeedback",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "fruitType",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "harvestDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			}
		],
		"name": "harvest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "conditions",
				"type": "string"
			}
		],
		"name": "packageFruits",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "saleDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "sellToConsumer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "batchId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "departureTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "estimatedArrivalTime",
				"type": "uint256"
			}
		],
		"name": "transport",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_farmer",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_transporter",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_retailer",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "farmer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextBatchId",
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
		"inputs": [],
		"name": "retailer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "transporter",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
   
];

const contractAddress1 = '0x07f9b079E43E4382c1B0C7df408FA440a3e074d1'; 
const contractAddress2 = '0x8fe68a003908003f2F75C4be2FA4adA3eB809B4B'; 
const contractAddress3 = '0x811c790bB3B7fec44768b70407d6Cd20459949Bb';

const contract1 = new web3.eth.Contract(contractABI, contractAddress1); 
const contract2 = new web3.eth.Contract(contractABI, contractAddress2);
const contract3 = new web3.eth.Contract(contractABI, contractAddress3);

 initButtonListeners();


// Use .then to ensure that init() has been completed before accessing the contracts
init().then(() => {
  // Now you can use contract1, contract2, and contract3 safely here.
  // For example, you can call methods, listen for events, etc.
}).catch((err) => {
  console.error("Initialization failed:", err);
});


async function executeContractMethod(methodName, args, contractInstance) {
    try {
        const result = await contractInstance.methods[methodName](...args).send({ from: userAddress });

        // 更新Transaction Hash和Transaction Status
        document.getElementById('transactionHash').innerText = result.transactionHash;
        document.getElementById('transactionStatus').innerText = result.status ? 'Successful' : 'Failed';

        console.log(`${methodName} executed successfully:`, result);
        return result;
    } catch (error) {
        console.error(`An error occurred while executing ${methodName}:`, error);
        
        // 如果交易失败，更新交易状态为"Failed"
        document.getElementById('transactionStatus').innerText = 'Failed';

        throw error;
    }
}

async function harvest(fruitType, harvestDate, quantity, contractInstance) {
    return executeContractMethod('harvest', [fruitType, harvestDate, quantity], contractInstance);
}

async function packageFruits(batchId, date, conditions, contractInstance) {
    return executeContractMethod('packageFruits', [batchId, date, conditions], contractInstance);
}

async function transport(batchId, departureTime, estimatedArrivalTime, contractInstance) {
    return executeContractMethod('transport', [batchId, departureTime, estimatedArrivalTime], contractInstance);
}

async function confirmArrival(batchId, actualArrivalTime, condition, contractInstance) {
    return executeContractMethod('confirmArrival', [batchId, actualArrivalTime, condition], contractInstance);
}

async function sellToConsumer(batchId, saleDate, price, contractInstance) {
    return executeContractMethod('sellToConsumer', [batchId, saleDate, price], contractInstance);
}

async function giveFeedback(batchId, feedback, contractInstance) {
    return executeContractMethod('giveFeedback', [batchId, feedback], contractInstance);
}


function initButtonListeners() {
    // Harvest button
    document.getElementById('harvestButton').addEventListener('click', async function() {
        const fruitType = document.getElementById('fruitType').value;
        const harvestDate = document.getElementById('harvestDate').value;
        const quantity = document.getElementById('quantity').value;
        await executeContractMethod('harvest', [fruitType, harvestDate, quantity], contract1);
    });

    // Package Fruits button
    document.getElementById('packageButton').addEventListener('click', async function() {
        const batchId = document.getElementById('batchId').value;
        const date = document.getElementById('date').value;
        const conditions = document.getElementById('conditions').value;
        await executeContractMethod('packageFruits', [batchId, date, conditions], contract1);
    });

    // Transport button
    document.getElementById('transportButton').addEventListener('click', async function() {
        const batchId = document.getElementById('transportBatchId').value;
        const departureTime = document.getElementById('departureTime').value;
        const estimatedArrivalTime = document.getElementById('estimatedArrivalTime').value;
        await executeContractMethod('transport', [batchId, departureTime, estimatedArrivalTime], contract2);
    });

    // Confirm Arrival button
    document.getElementById('confirmArrivalButton').addEventListener('click', async function() {
        const batchId = document.getElementById('arrivalBatchId').value;
        const actualArrivalTime = document.getElementById('actualArrivalTime').value;
        const condition = document.getElementById('condition').value;
        await executeContractMethod('confirmArrival', [batchId, actualArrivalTime, condition], contract3);
    });

    // Sell to Consumer button
    document.getElementById('sellButton').addEventListener('click', async function() {
        const batchId = document.getElementById('sellBatchId').value;
        const saleDate = document.getElementById('saleDate').value;
        const price = document.getElementById('price').value;
        await executeContractMethod('sellToConsumer', [batchId, saleDate, price], contract3);
    });

    // Give Feedback button
    document.getElementById('feedbackButton').addEventListener('click', async function() {
        const batchId = document.getElementById('feedbackBatchId').value;
        const feedback = document.getElementById('feedback').value;
        await executeContractMethod('giveFeedback', [batchId, feedback], contract3);
    });
}
      document.addEventListener('DOMContentLoaded', function() {
    initButtonListeners();
});


