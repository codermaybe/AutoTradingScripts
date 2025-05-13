require("dotenv").config();
const { Web3 } = require("web3");
const fs = require("fs");
const path = require("path");

async function main() {
  // 检查环境变量
  console.log("Environment variables:");
  console.log("RPC_URL:", process.env.RPC_URL);
  console.log("TARGET_CONTRACT_ADDRESS:", process.env.TAEGET_CONTRACT_ADDRESS);
  console.log("TOKEN0_ADDRESS:", process.env.TOKEN0_ADDRESS);
  console.log("TOKEN1_ADDRESS:", process.env.TOKEN1_ADDRESS);
  console.log(
    "NONFUNGIBLE_POSITION_MANAGER_ADDRESS:",
    process.env.NONFUNGIBLE_POSITION_MANAGER_ADDRESS
  );
  console.log("TARGET_CHAIN_NAME:", process.env.TARGET_CHAIN_NAME);

  if (
    !process.env.RPC_URL ||
    !process.env.TOKEN0_ADDRESS ||
    !process.env.TOKEN1_ADDRESS ||
    !process.env.NONFUNGIBLE_POSITION_MANAGER_ADDRESS
  ) {
    throw new Error(
      "Missing required environment variables. Please check your .env file."
    );
  }

  const web3 = new Web3(process.env.RPC_URL);

  // 使用私钥创建账户
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  web3.eth.accounts.wallet.add(account);
  console.log("Using account:", account.address);

  // 加载 Position Manager ABI
  const positionManagerAbiPath = path.join(
    __dirname,
    `../abis/${process.env.TARGET_CHAIN_NAME}/${process.env.NONFUNGIBLE_POSITION_MANAGER_ADDRESS}.abi`
  );
  console.log("Loading ABI from:", positionManagerAbiPath);

  if (!fs.existsSync(positionManagerAbiPath)) {
    throw new Error(`ABI file not found at ${positionManagerAbiPath}`);
  }

  const positionManagerAbiContent = fs.readFileSync(
    positionManagerAbiPath,
    "utf8"
  );
  const positionManagerAbi = JSON.parse(positionManagerAbiContent);

  // 创建 Position Manager 合约实例
  const positionManager = new web3.eth.Contract(
    positionManagerAbi,
    process.env.NONFUNGIBLE_POSITION_MANAGER_ADDRESS
  );

  // 加载代币 ABI
  const tokenAbiPath = path.join(__dirname, "../abis/ERC20.abi");
  const tokenAbiContent = fs.readFileSync(tokenAbiPath, "utf8");
  const tokenAbi = JSON.parse(tokenAbiContent);

  try {
    // 创建 WETH 合约实例
    const wethContract = new web3.eth.Contract(
      tokenAbi,
      process.env.TOKEN0_ADDRESS
    );

    // 检查 WETH 余额
    const wethBalance = await wethContract.methods
      .balanceOf(account.address)
      .call();
    console.log("WETH Balance:", web3.utils.fromWei(wethBalance, "ether"));

    // 设置添加流动性的参数
    const params = {
      token0: process.env.TOKEN0_ADDRESS,
      token1: process.env.TOKEN1_ADDRESS,
      //fee: 1000, // 0.1% 费率
      tickSpacing: 200,
      tickLower: -10000, // 扩大 tick 范围
      tickUpper: 10000, // 扩大 tick 范围
      amount0Desired: web3.utils.toWei("0.1", "ether"), // WETH 数量
      amount1Desired: "0", // 不添加 Token1
      amount0Min: web3.utils.toWei("0.03", "ether"), // 设置最小 WETH 数量
      amount1Min: "0", // 最小 Token1 数量
      recipient: account.address,
      deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20分钟后过期
    };

    console.log("Adding liquidity with parameters:", params);

    // 授权 Position Manager 使用 WETH
    console.log("Approving WETH...");
    await wethContract.methods
      .approve(
        process.env.NONFUNGIBLE_POSITION_MANAGER_ADDRESS,
        params.amount0Desired
      )
      .send({
        from: account.address,
        gas: 1000000, // 增加 gas 限制
      });

    // 添加流动性
    console.log("Adding liquidity...");
    const mintTx = await positionManager.methods.mint(params).send({
      from: account.address,
      gas: 10000000, // 增加 gas 限制
    });
    console.log("Mint transaction hash:", mintTx.transactionHash);

    // 获取用户的 positions
    const balance = await positionManager.methods
      .balanceOf(account.address)
      .call();
    console.log("User's position count:", balance);

    if (balance > 0) {
      // 获取第一个 position 的 ID
      const positionId = await positionManager.methods
        .tokenOfOwnerByIndex(account.address, 0)
        .call();
      console.log("First position ID:", positionId);

      // 获取 position 信息
      const position = await positionManager.methods
        .positions(positionId)
        .call();
      console.log("Position info:", position);
    }
  } catch (error) {
    console.error("Error:", error);
    if (error.cause) {
      console.error("Error cause:", error.cause);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
