require("dotenv").config();
const { Web3 } = require("web3");
const fs = require("fs");
const path = require("path");

async function main() {
  const web3 = new Web3(process.env.RPC_URL);
  const contractAddress = process.env.TARGET_CONTRACT_ADDRESS;

  console.log("开始验证合约地址:", contractAddress);
  console.log("----------------------------------------");

  try {
    // 1. 检查网络连接
    const networkId = await web3.eth.net.getId();
    const blockNumber = await web3.eth.getBlockNumber();
    console.log("网络信息:");
    console.log("- Network ID:", networkId);
    console.log("- 当前区块高度:", blockNumber);
    console.log("----------------------------------------");

    // 2. 检查合约代码
    const code = await web3.eth.getCode(contractAddress);
    console.log("合约代码检查:");
    console.log("- 合约代码长度:", code.length);
    console.log("- 是否有合约代码:", code !== "0x" && code !== "");
    console.log("----------------------------------------");

    // 3. 检查合约余额
    const balance = await web3.eth.getBalance(contractAddress);
    console.log("合约余额检查:");
    console.log("- 余额(wei):", balance);
    console.log("- 余额(ETH):", web3.utils.fromWei(balance, "ether"));
    console.log("----------------------------------------");

    // 4. 检查最近的交易
    console.log("正在获取最近的交易...");
    const latestBlock = await web3.eth.getBlock("latest");
    const transactions = await web3.eth.getBlock(latestBlock.number, true);

    const contractTxs = transactions.transactions.filter(
      (tx) => tx.to && tx.to.toLowerCase() === contractAddress.toLowerCase()
    );

    console.log("最近区块中的合约交易:");
    console.log("- 最近区块号:", latestBlock.number);
    console.log("- 该区块中与合约相关的交易数:", contractTxs.length);

    if (contractTxs.length > 0) {
      console.log("- 最新交易哈希:", contractTxs[0].hash);
    }
    console.log("----------------------------------------");

    // 5. 检查合约创建区块
    console.log("正在查找合约创建区块...");
    let found = false;
    for (let i = 0; i < 100; i++) {
      // 检查最近100个区块
      const block = await web3.eth.getBlock(latestBlock.number - i, true);
      const tx = block.transactions.find(
        (tx) =>
          tx.to === null &&
          tx.contractAddress &&
          tx.contractAddress.toLowerCase() === contractAddress.toLowerCase()
      );

      if (tx) {
        console.log("合约创建信息:");
        console.log("- 创建区块:", block.number);
        console.log("- 创建交易:", tx.hash);
        console.log("- 创建者地址:", tx.from);
        found = true;
        break;
      }
    }

    if (!found) {
      console.log("未能在最近100个区块中找到合约创建信息");
    }
  } catch (error) {
    console.error("验证过程中出错:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
