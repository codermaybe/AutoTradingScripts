require("dotenv").config();
const { Web3 } = require("web3");
const fs = require("fs");
const path = require("path");

async function main() {
  // 初始化 web3 实例
  const web3 = new Web3(process.env.RPC_URL);

  // 检查 RPC 连接
  try {
    const networkId = await web3.eth.net.getId();
    const blockNumber = await web3.eth.getBlockNumber();
    console.log("Network ID:", networkId);
    console.log("Current Block Number:", blockNumber);
  } catch (error) {
    console.error("RPC 连接失败:", error.message);
    process.exit(1);
  }

  const contractAddress = process.env.TARGET_CONTRACT_ADDRESS;
  const abiPath = path.join(
    __dirname,
    `../abis/${process.env.Target_CHAIN_NAME}/${contractAddress}.abi`
  );

  // 直接读取并解析ABI文件
  const abiContent = fs.readFileSync(abiPath, "utf8");
  const contractAbi = JSON.parse(abiContent);

  // 新增：打印ABI关键信息
  console.log("加载的ABI长度:", contractAbi.length);
  console.log(
    "ABI中是否包含token0方法:",
    contractAbi.some((item) => item.name === "token0")
  );
  console.log(
    "ABI中是否包含token1方法:",
    contractAbi.some((item) => item.name === "token1")
  );

  // 确保ABI是数组格式
  if (!Array.isArray(contractAbi)) {
    throw new Error("ABI必须是数组格式");
  }

  // 创建合约实例
  const contract = new web3.eth.Contract(contractAbi, contractAddress);

  try {
    // 检查合约地址是否有效
    const code = await web3.eth.getCode(contractAddress);
    if (code === "0x" || code === "") {
      throw new Error(`合约地址 ${contractAddress} 无效或未部署`);
    }

    // 使用 web3.js 的方式调用合约方法
    console.log("正在调用 token0()...");
    const token0 = await contract.methods.token0().call();
    console.log("正在调用 token1()...");
    const token1 = await contract.methods.token1().call();

    console.log("Token0 Address:", token0);
    console.log("Token1 Address:", token1);

    // 验证获取的地址有效性
    if (!token0 || !token1) {
      throw new Error("获取到的token地址无效");
    }
  } catch (error) {
    console.error("详细错误信息:", {
      message: error.message,
      stack: error.stack,
      // 获取合约所有方法名
      contractMethods: contract._jsonInterface
        .map((f) => f.name)
        .filter(Boolean),
    });
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
