const { Web3 } = require("web3")
const abiFile = require("../build/contracts/Transaction.json")

const endpoint = 'http://127.0.0.1:7545';
const web3 = new Web3(endpoint);
const contractAddress = abiFile.networks[5777].address

const contract = new web3.eth.Contract(abiFile.abi, contractAddress)
const Wallet = require('ethereumjs-wallet');


//to verify Signature
const verifySignature = (rawTransaction, expectedAddress, message) => {
    try {
        // Extract sender's address from the rawTransaction
        const recoveredAddress = web3.eth.accounts.recoverTransaction(rawTransaction);
        
        // Compare recovered address with expected address
        if (recoveredAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
            throw new Error("Signature verification failed: Address mismatch");
        }
        
        console.log("Signature verified successfully. Sender's address:", recoveredAddress);
        console.log(message);
        return true; // Signature is valid
    } catch (error) {
        console.error("Error verifying signature:", error.message);
        return false; // Signature is invalid
    }
};

//Send request back to Cloud Server frm Berthing Ship
const sendBStoCS = async() => {

    const accounts = await web3.eth.getAccounts()
    const _from = accounts[0]
    const privateKey = "0xeacaa808581a2b758c850101a6e0a01fface5fc0780a00cbb70b368f276be10a"
    const suggestion_gas = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(_from, 'pending');

    const tx = {
        
        from: _from,
        to: contractAddress,
        nonce: nonce,
        gas: 50000,
        gasPrice: web3.utils.toHex(suggestion_gas),
        data: contract.methods.BerthingShipToCloudServer().encodeABI()
    }

    const signature = await web3.eth.accounts.signTransaction(tx, privateKey)
    //console.log(signature)
    
    return signature.rawTransaction;
}

//Recieve Transaction from berthing Ship
//verify signature passed with the transaction
//Send request back to Berthing Ship From Cloud Server

const sendCStoBS = async(SignBS) => {

    const accounts = await web3.eth.getAccounts()
    const expectedAddress = accounts[0];
    try {
        //Signature Verification
        const isSignatureValid = verifySignature(SignBS, expectedAddress, "Transaction Recieved successfully From Berthing Ship to Cloud Server");
        if (!isSignatureValid) {
            console.error("Signature verification failed. Aborting transaction.");
            return;
        }

        await web3.eth.sendSignedTransaction(SignBS).on(
            "receipt", async()=>{
                const events = await contract.getPastEvents("BStoCS", {fromBlock:"latest", toBlock: "latest"})
                console.log(events);
            }
        )

        //transaction
        const _from = accounts[1]
        const privateKey = "0x081fad6adf7089d880263e0a10932de9f1eb6e19a39faecbf6075117ea4fc6c1"
        const suggestion_gas = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(_from, 'pending');

        const tx = {
            
            from: _from,
            to: contractAddress,
            nonce: nonce,
            gas: 50000,
            gasPrice: web3.utils.toHex(suggestion_gas),
            data: contract.methods.CloudServerToBerthingShip().encodeABI()
        }

        const signature = await web3.eth.accounts.signTransaction(tx, privateKey)
        //console.log(signature)
       
        return signature.rawTransaction;
    } catch (error) {
        console.error("Error verifying signature:", error.message);
        throw error;
    }

}

//Recieve Transaction from Cloud Server
//verify signature passed with the transaction
//Send transaction to Smart IOT Devices From Berthing Ship
const sendBStoSD = async(SignCS) => {

    try {
        // Expected address of the sender
        const accounts = await web3.eth.getAccounts()
        const expectedAddress = accounts[1]; // Replace with the expected address
        
        // Verify the signature
        const isSignatureValid = verifySignature(SignCS, expectedAddress, "Transaction Recieved successfully From Cloud Server to Berthing Ship");
        if (!isSignatureValid) {
            console.error("Signature verification failed. Aborting transaction.");
            return;
        }

        await web3.eth.sendSignedTransaction(SignCS).on(
            "receipt", async()=>{
                const events = await contract.getPastEvents("CStoBS", {fromBlock:"latest", toBlock: "latest"})
                console.log(events);
            }
        )

        const _from = accounts[0]
        const privateKey = "0xeacaa808581a2b758c850101a6e0a01fface5fc0780a00cbb70b368f276be10a"
        const suggestion_gas = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(_from, 'pending');

        const tx = {
            
            from: _from,
            to: contractAddress,
            nonce: nonce,
            gas: 50000,
            gasPrice: web3.utils.toHex(suggestion_gas),
            data: contract.methods.BerthingShipToSmartDevice().encodeABI()
        }

        const signature = await web3.eth.accounts.signTransaction(tx, privateKey)
        //console.log(signature)
        
        return signature.rawTransaction;
    } catch (error) {
        console.error('Error in sendCStoBS:', error);
        throw error; // Re-throw the error for handling in the caller
    }

    
}

//Recieve Transaction by Smart IoT device
//verify signature passed with the transaction
//Send transactin to Berthing Ship From Smart IOT Devices
const sendSDtoBS = async(Sign1BS) => {

    try {
        // Expected address of the sender
        const accounts = await web3.eth.getAccounts()
        const expectedAddress = accounts[0]; // Replace with the expected address
        
        // Verify the signature
        const isSignatureValid = verifySignature(Sign1BS, expectedAddress, "Transaction Recieved successfully From Berthing Ship to Smart IOT Device");
        if (!isSignatureValid) {
            console.error("Signature verification failed. Aborting transaction.");
            return;
        }

        await web3.eth.sendSignedTransaction(Sign1BS).on(
            "receipt", async()=>{
                const events = await contract.getPastEvents("BStoSD", {fromBlock:"latest", toBlock: "latest"})
                console.log(events);
            }
        )

        const _from = accounts[2]
        const privateKey = "0x78ace49597abc5bc18032588e787019a9b835b98771e6e02e71ba57876a527e1"
        const suggestion_gas = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(_from, 'pending');

        const tx = {
            from: _from,
            to: contractAddress,
            nonce: nonce,
            gas: 50000,
            gasPrice: web3.utils.toHex(suggestion_gas),
            data: contract.methods.SmartDeviceToBerthingShip().encodeABI()
        }

        const signature = await web3.eth.accounts.signTransaction(tx, privateKey)
        //console.log(signature)
        
        return signature.rawTransaction;
    } catch (error) {
        console.error('Error in sendCStoBS:', error);
        throw error; // Re-throw the error for handling in the caller
    }

    
}

//Recieve Transaction by Berthing Ship
//verify signature passed with the transaction
const FinalRecievedByBsFromSD = async(SignSD) => {
    try {
        // Expected address of the sender (Smart Device)
        const accounts = await web3.eth.getAccounts()
        const expectedAddress = "0xfBd4cC151d20242934baf18e5f143A3f73713679"; // Replace with the expected address
        
        // Verify the signature
        const isSignatureValid = verifySignature(SignSD, expectedAddress, "Transaction Recieved successfully From Smart Device to Berthing Ship");
        if (!isSignatureValid) {
            console.error("Signature verification failed. Aborting transaction.");
            return;
        }

        await web3.eth.sendSignedTransaction(SignSD).on(
            "receipt", async()=>{
                const events = await contract.getPastEvents("SDtoBS", {fromBlock:"latest", toBlock: "latest"})
                console.log(events);
            }
        )
    } catch (error) {
        console.error('Error in sendCStoBS:', error);
        throw error; // Re-throw the error for handling in the caller
    }
}

const runSequentially = async () => {

    try {
        const SignBS= await sendBStoCS();
        const SignCS = await sendCStoBS(SignBS);
        const Sign1BS =await sendBStoSD(SignCS);
        const SignSD = await sendSDtoBS(Sign1BS);
        await FinalRecievedByBsFromSD(SignSD);
    } catch (error) {
        console.error('Error:', error);
    }
        
    //to compute computation time taken
        // try {
            
        //     const startTime = Date.now();
        //     let num = 2;

        //         let SD_addresses = [
        //             ["0x43bD13438c4EE7f577CFf7eDEc529994866A975E", "0xed42f6d67c401e8db2a3e295238a4f35ba3c51025dcc2c28859dba3726f0c498"],
        //             ["0x6d733eFcD6e44eEbFA1Daf53feE398e144196Aca", "0xa850206721e50040666eddb814e9e646df5e9556124494cec8a3a6c444365204"],
        //             ["0x91627B54Deaca045a39ce6a2df1bB86a107e2E27", "0xf46a37aa1b360aebaeccb243f9ea6cd98e8c968f812551198b45b55b2c526f7c"],
        //             ["0xb45B9486D8F6B6357B49AD9fF21d255f57392F08", "0xe6f974d279b096778555eb52bd0c62e50c360a0546376b3d980054f33e2c4fae"],
        //             ["0xfC7A4f3C2AE8bCBeFF2Dea7a5cb5A126FEb1bc89", "0x59306a19ed49144e6e32b8d90b8d69e99dfccbb0b93590e08bc67030bb08a55a"],
        //             ["0x9693Dc13c4d47595E86C08C799f0A330115f95CE", "0x13a33d3bb97ea62207ff926eeb96ee55889c6cf3cc5d2f264864183df84486bf"],
        //             ["0x601B4414975d3EF9DF49661cFa9AF7248361ad81", "0x2b0d77ba66aca25fb5d013556d7836a7f738afe0d09dfa8e4622f3e6a93cfbf8"],
        //             ["0x11f479F9a22c4c6A89f7E48a4a56D47a57EF159F", "0xa517f1246f81f9282e5daf208ac98bdf8f97d2143aa4835e56173125fa82a6bd"],
        //             ["0xEC2500A7DB8aafEB6629a3408e1E5256cC627abD", "0xca66683bdd115427b65abf399d8537000e0e4f56166beb65ec4818b2331cabb0"],
        //             ["0x21e77e4d322eC81Ff70EB8253013b41418a082C6", "0x3eab3f37258985510bf409a23f61c95eeccfdc4e60d310b08a25eb67dc82d642"],
        //             ["0x81eEfc266b99a7FCF52415b8Cfbe22D6E5dD78A2", "0x88281d71bcbe6cf88f3c405564bf2568e957fd2364b27334fb0a6590240dca9b"],
        //             ["0xb5456faf265Cfd63650f24258b1f6eba666C07E2", "0x77df944d05cf53cf8803cd2a81fd9dc4d5a0294190089740533db1fb12412124"],
        //             ["0xEaa22d18Fd559000260318F344b6422E080b3516", "0x10b46762f1abfbd61723e65c00b71119f7c8d5d9bd31a818ef970ae89ac491d1"],
        //             ["0xF64a612fF8a6241F5700d2f2Bf7f6b582935021C", "0xd227e141ed2b2730459fac77ea7eff15fcc6ad81d0466d27202a7c8817e27114"],
        //             ["0xD4a4f39C9814354211fAEc882DBd7Ec6e73dA968", "0x51ff6c4ab2947a5d4ee6856247d8b0d7135dee562d01035a16e360615b26d83c"],
        //             ["0xEB44f4e904f75A6dD9a28Ea03CA161C2146Da976", "0x025eca4c6c6b3f3bb29ff27387ef6a63e0ca12c1efc795bfa3ef55e778d000c9"],
        //             ["0x3689Ce5a183b5B0eE0c4b709d258620851aaAFab", "0xa6cfafe5ba206b039a4574d5981be1b0a3c3b6d302693c6cb841e44469fda21f"],
        //             ["0x9c484B6E4269D2E49470745cd8CBD58A1c50e196", "0x6dec123f232893bc62712531a91c6c45898db61cc51008efaac82fc7a2df17cd"],
        //             ["0x3d5aB4c14915AfE1fE7783ACBA84F8a93348906a", "0x1850471aa6ae29fb15f09bc1ab53b9b4b46b41572fa629fad0635d2b24037ff6"],
        //             ["0xCB01aBcAC114589145F85f821136819c0BCB5BCb", "0x8708dc99fba659f8f252bd0f86499c00f443db4be579c6911ee964ee931ab176"],
        //             ["0x7B27F6Bd03CE5942970fE3e1560dB4320CaB2ac8", "0x63045903a48f57996b85c64619434e26df2399614b7f7562ac2a1c69ce273676"],
        //             ["0x93E982F8CA496DAFfD7Bf0eC3e79C889B9F3d9A7", "0x0dfae03b9488af92e551a67c2acb971e2a5b610e393a735c7862ccf875e1b6e3"],
        //             ["0x57b326F4f11148158Ccc674b3364af28c7482c05", "0xee127ace97b3601553860f4a34de3379388bc09ecf66530df5f2fe52e1576bb4"],
        //             ["0x92A96D9E278791390aa8d7aaB4d83DDC4305922F", "0x8726dc1e2b32ddf9e75f055ba5ae5d99adc716b7a7199e64abb616dea086a80f"],
        //             ["0x5323b6ca4E09F1ddD1473a871acCA725e3649CA9", "0x6e2478f60cb3df22924d770d2216c29848bff1a53f49b03498cb93d7b84ce3b2"],
        //             ["0xf1EC8E830C18fF98796d4303da6f4622930A9E8d", "0x89ee375017d1f5cb778d4bb449da4d4e8e965bb4a80da465beb802a1f92ccc2f"],
        //             ["0x26ABbeC37f30149F782ACE59015665476D7F0849", "0xd12b6489257512678bdb2f871ac3352b3953237742c39bcb55962067a0290391"],
        //             ["0x40720265939B233eAED11F44bEfc5f5e9A67Be52", "0x7c8a7950a50725ccd194c5ed1f6dff48c4503a97964af4396d4f78c8abe6c5e3"],
        //             ["0xec12ca55F04bA94b08C902E40a5FC8b6ce23f04A", "0xafcf8428d2e369e73f8b6dedb5fe058d92adc72ff524c3fe01e416777d129a76"],
        //             ["0x11f0a83D41f197Bda8b82d97ce07595C960A775E", "0x998177aeb7b0743feca15c75df6946248c0a6d6c7720681635bb331fecd2c053"]
        //         ];
                
        //         const SignBS= await sendBStoCS();
        //         const SignCS = await sendCStoBS(SignBS);
        //         const Sign1BS =await sendBStoSD(SignCS);

        //         for(let i=0; i<29; i++) {
        //             const SignSD = await sendSDtoBS(Sign1BS, SD_addresses[i][0], SD_addresses[i][1]);
        //             await FinalRecievedByBsFromSD(SignSD, SD_addresses[i][0]);
        //             num+=2;
        //         } 
        //     console.log(`Block ${num } mined`); 
        //     const endTime = Date.now();
        //     const timeTaken = (endTime - startTime) / 1000; 
        //     console.log(`Time taken to mine ${num} blocks: ${timeTaken} seconds`);
        // } catch (error) {
        //     console.error('Error:', error);
        // }
};

runSequentially()