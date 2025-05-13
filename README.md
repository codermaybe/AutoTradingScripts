## hardhat 模拟配置

- 在 hardhat.config.js 中更改 networks-hardhat-forking 配置中的 URL 地址为指定地址并保存
- URL 例（sonic 主链） `https://rpc.ankr.com/sonic_mainnet`
- 执行`npx hardhat node`模拟主网环境（sonic 链
- 采用 hardhat node 首个账户私钥做交易
- 由于 sonic 链并无分叉等信息，和 eth 链有出如。hardhat 无法进行 fork 模拟交易。所有的交易只能在主链进行。
- 优先采用https://docs.uniswap.org/contracts/v3/reference/deployments/ethereum-deployments 中 主链部署的 uniswap 交易对进行交易测试。

## 变量

### 私钥均为 hardhat node 首个账户持有，此处留存方便切换。

### ETH MAINNET

HARDHAT_FORKING_URL=https://ethereum-rpc.publicnode.com
RPC_URL=http://127.0.0.1:8545/
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
TARGET_CONTRACT_ADDRESS=0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640
TOKEN0_ADDRESS=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
TOKEN1_ADDRESS=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
NONFUNGIBLE_POSITION_MANAGER_ADDRESS=0xC36442b4a4522E871399CD717aBDD847Ab11FE88
TARGET_CHAIN_NAME=Ethmain

### SONIC

- 此链暂无法执行 fork，正在找其他办法。
- 可用 anvil 模拟 ， 执行 anvil --fork-url <URL> 即可

HARDHAT_FORKING_URL=https://rpc.ankr.com/sonic_mainnet
RPC_URL=http://127.0.0.1:8545/
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
TARGET_CONTRACT_ADDRESS=0x8BC2f9e725cbB07c338df4e77c82190119ddd823
TOKEN0_ADDRESS=0x0555E30da8f98308EdB960aa94C0Db47230d2B9c
TOKEN1_ADDRESS=0x29219dd400f2Bf60E5a23d13Be72B486D4038894
NONFUNGIBLE_POSITION_MANAGER_ADDRESS=0x12E66C8F215DdD5d48d150c8f46aD0c6fB0F4406
TARGET_CHAIN_NAME=Sonic
