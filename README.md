## 初始化配置

- npm i 补齐包
- 将 env_example 文件重命名为.env 文件
- 补齐变量相关参数
- 注意目前需要手动添加对应合约的 abi 文件，可自行定义链名。
- 在 abis 文件夹下创建**同链名**文件夹并以 <合约地址>.abi 命名文件

## 启动

## 关于脚本

- 当前合约以 uniswap 的 abi 为模板，各个合约或 dex 有一定修改和出如。如命名不同参数相同，命名相同参数不同等，需要自行修改。
- 当前 TransactionWithContract.js 中交易参数 params **有问题**，需要根据指定合约情况调整。

## 模拟配置

### hardhat

- 在 自行定义的 .env 中更改 HARDHAT_FORKING_URL 为指定地址并保存
- URL 例（sonic 主链） `https://rpc.ankr.com/sonic_mainnet`
- 执行`npx hardhat node`模拟主链环境
- 下列示例采用 hardhat node 首个账户私钥做交易
- 可以优先采用https://docs.uniswap.org/contracts/v3/reference/deployments/ethereum-deployments 中 主链部署的 uniswap 交易对进行交易测试。
- 可以先复制下列参数进行模拟测试，自行调整参数。

### anvil

- 自行查找攻略安装
- 用 anvil 模拟 ， 执行 anvil --fork-url YOUR-URL 即可

### 私钥均为 hardhat node 首个账户持有，此处留存方便切换，anvil 相同。

### 变量实例

#### ETH MAINNET

HARDHAT_FORKING_URL=https://ethereum-rpc.publicnode.com

RPC_URL=http://127.0.0.1:8545/
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
TARGET_CONTRACT_ADDRESS=0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640
TOKEN0_ADDRESS=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
TOKEN1_ADDRESS=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
NONFUNGIBLE_POSITION_MANAGER_ADDRESS=0xC36442b4a4522E871399CD717aBDD847Ab11FE88
TARGET_CHAIN_NAME=Ethmain

#### SONIC

- 此链暂无法用 hardhat 模拟，只能用 anvil。

HARDHAT_FORKING_URL=https://rpc.ankr.com/sonic_mainnet

RPC_URL=http://127.0.0.1:8545/
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
TARGET_CONTRACT_ADDRESS=0x8BC2f9e725cbB07c338df4e77c82190119ddd823
TOKEN0_ADDRESS=0x0555E30da8f98308EdB960aa94C0Db47230d2B9c
TOKEN1_ADDRESS=0x29219dd400f2Bf60E5a23d13Be72B486D4038894
NONFUNGIBLE_POSITION_MANAGER_ADDRESS=0x12E66C8F215DdD5d48d150c8f46aD0c6fB0F4406
TARGET_CHAIN_NAME=Sonic
