export const binaryIPtoDecimal = (binaryIP) => {
  let start = 0;
  let ip = [];

  for (let i = 1; i <= 4; i++) {
    let oct = binaryIP.substr(start, 8).toString(2);
    ip.push(parseInt(oct, 2).toString(10));
    start += 8;
  }
  ip = ip.join('.');
  return ip;
};

export const getHostIP = (networkIP, host) => {
  let firstHostIP = [];
  for (let i = 0; i < 32; i++) {
    let a = networkIP[i].toString(10) * 1;
    let b = host[i].toString(10) * 1;
    let bit = a | b;
    firstHostIP.push(bit.toString(2));
  }
  firstHostIP = firstHostIP.join('');

  return firstHostIP;
};

export const allocateSubnet = (
  id,
  binaryNetIP,
  subnetMask,
  subnetAllocation
) => {
  let networkIP = binaryNetIP;
  let firstHost = networkIP.substring(subnetMask, 32).toString(10) * 1 + 1;
  firstHost = firstHost.toString(2).padStart(32, '0');

  let firstHostIP = getHostIP(networkIP, firstHost);
  // console.log('firstHostIP:', firstHostIP, 'subnet:', subnetMask);

  let broadcast = (
    networkIP.substring(subnetMask, 32).toString(10) * 1 +
    Math.pow(2, 32 - subnetMask) -
    1
  )
    .toString(2)
    .padStart(32, '0');

  let broadcastIP = getHostIP(networkIP, broadcast);
  // console.log('Broadcast  :', broadcastIP, 'subnet:', subnetMask);

  let lastHost = (
    networkIP.substring(subnetMask, 32).toString(10) * 1 +
    Math.pow(2, 32 - subnetMask) -
    2
  )
    .toString(2)
    .padStart(32, '0');

  // console.log('lastHost:', lastHost);
  let lastHostIP = getHostIP(networkIP, lastHost);
  // console.log('lastHostIP :', lastHostIP, 'subnet:', subnetMask);

  subnetAllocation = [
    ...subnetAllocation,
    {
      id,
      networkIP,
      firstHostIP,
      lastHostIP,
      broadcastIP,
      subnetMask,
    },
  ];

  return subnetAllocation;
};

export const calculateSubnetIP = (sourceIP, sourceSubnet, hostBit) => {
  let tempSubnetList = [];
  let subnetMask = 32 - hostBit;

  let maskDifference = subnetMask - sourceSubnet;
  for (let i = 0; i < Math.pow(2, maskDifference); i++) {
    let newIP = sourceIP.substr(0, sourceSubnet);
    let part2 = i.toString(2).padStart(maskDifference, '0');
    newIP = newIP.concat(part2);
    newIP = newIP.padEnd(32, '0');

    tempSubnetList.unshift({ binaryIP: newIP, subnetMask });
  }

  return tempSubnetList;
};
