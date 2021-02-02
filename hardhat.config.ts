import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";
import "solidity-coverage";

export default {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.6.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
    }
  },
  gasReporter: {
    enabled: true
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};
