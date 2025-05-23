require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",

  networks: {
    hardhat: {
      forking: {
        url: process.env.HARDHAT_FORKING_URL,
      },
    },
  },
};
