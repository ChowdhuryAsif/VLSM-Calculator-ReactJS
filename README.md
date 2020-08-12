# VLSM-Subnet-Mask-Calculator using ReactJS

VLSM or Variable Length Subnet Masking is a process of allocating subnet masks where the length is not restricted by IP classes. It allows subdividing a subnet for more optimal usage and less IP wastage.

## App: [subnet-mask-calculator.netlify.app](https://subnet-mask-calculator.netlify.app/)

## Workflow:

1. Enter ISP has provided network IP in (a.b.c.d/mask) format, which is known as CIDR format.
2. Enter the Host Group information (Name and Size). For example:
   - CSE (60 devices)
   - BBA (20 devices)
   - EEE (30 devices)
3. Click Calculate Subnect Allocation button to get the allocation result in terms of {Network IP, First Host IP, Last Host IP, Broadcast IP} for every group.

## GNS3 Topology integration.

1. Design a network Topology using GNS3 or upload a GNS3 project file.
2. The App will autometically allocate the subnet mask for each LAN and will give the result as well.
