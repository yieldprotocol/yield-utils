const fixed_addrs = require('./fixed_addrs.json');
const Vat = artifacts.require("Vat");
const Weth = artifacts.require("WETH9");
const GemJoin = artifacts.require("GemJoin");
const ERC20 = artifacts.require("TestERC20");
const DaiJoin = artifacts.require("DaiJoin");
const Jug = artifacts.require("Jug");
const Pot = artifacts.require("Pot");
const End = artifacts.require("End");
const Chai = artifacts.require("Chai");
const GasToken = artifacts.require("GasToken1");
const ChaiOracle = artifacts.require("ChaiOracle");
const WethOracle = artifacts.require("WethOracle");
const Treasury = artifacts.require("Treasury");
const Dealer = artifacts.require("Dealer");
const Liquidations = artifacts.require("Liquidations");
const Splitter = artifacts.require("Splitter");
const EthProxy = artifacts.require("EthProxy");
const Unwind = artifacts.require("Unwind");


module.exports = async (deployer, network, accounts) => {

  let vatAddress;
  let wethAddress;
  let wethJoinAddress;
  let daiAddress;
  let daiJoinAddress;
  let jugAddress;
  let potAddress;
  let endAddress;
  let chaiAddress;
  let gasTokenAddress;
  let chaiOracleAddress;
  let wethOracleAddress;
  let treasuryAddress;
  let dealerAddress;
  let splitterAddress;
  let liquidationsAddress;
  let ethProxyAddress;
  let unwindAddress;

  const auctionTime = 3600; // TODO: Think where to store this parameter.

  if (network !== 'development') {
    vatAddress = fixed_addrs[network].vatAddress ;
    wethAddress = fixed_addrs[network].wethAddress;
    wethJoinAddress = fixed_addrs[network].wethJoinAddress;
    daiAddress = fixed_addrs[network].daiAddress;
    daiJoinAddress = fixed_addrs[network].daiJoinAddress;
    jugAddress = fixed_addrs[network].jugAddress;
    potAddress = fixed_addrs[network].potAddress;
    endAddress = fixed_addrs[network].endAddress;
    fixed_addrs[network].chaiAddress ? 
      (chaiAddress = fixed_addrs[network].chaiAddress)
      : (chaiAddress = (await Chai.deployed()).address);
  } else {
      vatAddress = (await Vat.deployed()).address;
      wethAddress = (await Weth.deployed()).address;
      wethJoinAddress = (await GemJoin.deployed()).address;
      daiAddress = (await ERC20.deployed()).address;
      daiJoinAddress = (await DaiJoin.deployed()).address;
      jugAddress = (await Jug.deployed()).address;
      potAddress = (await Pot.deployed()).address;
      endAddress = (await End.deployed()).address;
      chaiAddress = (await Chai.deployed()).address;
  }

  const treasury = await Treasury.deployed();
  treasuryAddress = treasury.address;
  wethOracleAddress = (await WethOracle.deployed()).address;
  chaiOracleAddress = (await ChaiOracle.deployed()).address;
  gasTokenAddress = (await GasToken.deployed()).address;
  const dealer = await Dealer.deployed();
  dealerAddress = dealer.address;

  // Setup Splitter
  await deployer.deploy(
    Splitter,
    treasuryAddress,
    dealerAddress,
  );
  splitterAddress = (await Splitter.deployed()).address;
  await dealer.grantAccess(splitterAddress);
  await treasury.grantAccess(splitterAddress);

  // Setup Liquidations
  await deployer.deploy(
    Liquidations,
    daiAddress,
    treasuryAddress,
    dealerAddress,
    auctionTime,
  )
  liquidationsAddress = (await Liquidations.deployed()).address;
  await dealer.grantAccess(liquidationsAddress);
  await treasury.grantAccess(liquidationsAddress);

  // Setup Unwind
  await deployer.deploy(
    Unwind,
    vatAddress,
    daiJoinAddress,
    wethAddress,
    wethJoinAddress,
    jugAddress,
    potAddress,
    endAddress,
    chaiAddress,
    chaiOracleAddress,
    treasuryAddress,
    dealerAddress,
    liquidationsAddress,
  );
  const unwind = await Unwind.deployed();
  unwindAddress = unwind.address;
  await dealer.grantAccess(unwindAddress);
  await treasury.grantAccess(unwindAddress);
  await treasury.registerUnwind(unwindAddress);
  // TODO: Retrieve the addresses for yDai contracts
  // await yDai1.grantAccess(unwindAddress);
  // await yDai2.grantAccess(unwindAddress);
  // await unwind.addSeries(yDai1.address, { from: owner });
  // await unwind.addSeries(yDai2.address, { from: owner });

  // Setup EthProxy
  await deployer.deploy(
    EthProxy,
    wethAddress,
    gasTokenAddress,
    dealerAddress,
  );
  ethProxyAddress = (await EthProxy.deployed()).address;

  const deployedPeripheral = {
    'Splitter': splitterAddress,
    'Liquidations': liquidationsAddress,
    'Unwind': unwindAddress,
    'EthProxy': ethProxyAddress,
  }
  console.log(deployedPeripheral);
};