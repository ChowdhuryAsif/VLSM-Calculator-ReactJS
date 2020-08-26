import React, { useState } from 'react';
import { Container, Row, Col, Button, Table } from 'reactstrap';

import {
  binaryIPtoDecimal,
  allocateSubnet,
  calculateSubnetIP,
} from '../utils/Utility';

import { downloadFile } from '../utils/CSVFileMaker';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import '../main.css';

const Subnets = (props) => {
  const ispBinaryIP = sessionStorage.getItem('ispBinaryIP');
  const ispIP = sessionStorage.getItem('ispIP');
  const ispSubnet = sessionStorage.getItem('subnet');

  let lans = [...props.lans];
  lans.sort((a, b) => b.hostNumber - a.hostNumber);

  let subnetBusket = [{ binaryIP: ispBinaryIP, subnetMask: ispSubnet }];
  let subnetAllocation = [];

  // start subnetting with the max number of host
  if (props.isOpenSubnetsTable) {
    for (let i = 0; i < lans.length; i++) {
      let sourceIP = subnetBusket[0].binaryIP;
      let sourceSubnet = subnetBusket[0].subnetMask;
      subnetBusket.shift();

      // calculateSubnetIP is return a list of new subnets
      calculateSubnetIP(
        sourceIP,
        sourceSubnet,
        lans[i].size
      ).forEach((subnet) => subnetBusket.unshift(subnet));

      // subnet allocation for each LAN
      subnetAllocation = allocateSubnet(
        lans[i].id,
        subnetBusket[0].binaryIP,
        subnetBusket[0].subnetMask,
        subnetAllocation
      );
      subnetBusket.shift();
    }
  }

  const renderTable = () => {
    let lans = [...props.lans];
    const lanList = lans.map((lan) => {
      let tempNet = subnetAllocation.find((net) => net.id === lan.id);
      return (
        <tr key={lan.id}>
          <th scope="row">{lan.id}</th>
          <td>{lan.name}</td>
          <td>{Math.pow(2, lan.size)}</td>
          <td>
            {binaryIPtoDecimal(tempNet.networkIP)}/{tempNet.subnetMask}
          </td>
          <td>
            {binaryIPtoDecimal(tempNet.firstHostIP)}/{tempNet.subnetMask}
          </td>
          <td>
            {binaryIPtoDecimal(tempNet.lastHostIP)}/{tempNet.subnetMask}
          </td>
          <td>
            {binaryIPtoDecimal(tempNet.broadcastIP)}/{tempNet.subnetMask}
          </td>
        </tr>
      );
    });
    return lanList;
  };

  const makeCsvFile = (event) => {
    event.preventDefault();
    let lans = [...props.lans];

    const lanList = lans.map((lan) => {
      let tempNet = subnetAllocation.find((net) => net.id === lan.id);
      return {
        id: `${lan.id}`,
        name: `${lan.name}`,
        size: `${Math.pow(2, lan.size)}`,
        networkIP: `${binaryIPtoDecimal(tempNet.networkIP)}/${
          tempNet.subnetMask
        }`,
        firstHostIP: `${binaryIPtoDecimal(tempNet.firstHostIP)}/${
          tempNet.subnetMask
        }`,
        lastHostIP: `${binaryIPtoDecimal(tempNet.lastHostIP)}/${
          tempNet.subnetMask
        }`,
        broadcastIP: `${binaryIPtoDecimal(tempNet.broadcastIP)}/${
          tempNet.subnetMask
        }`,
      };
    });

    downloadFile(lanList);
  };

  return (
    <div id="subnetAllocation">
      <Container className="themed-container" fluid>
        <Row>
          <Col md="8" className="offset-md-2 text-warning text-center">
            <h3>Subnets Allocation</h3>
          </Col>
        </Row>
        <Row>
          <Col md="8" className="offset-md-2">
            <Table dark className="table-striped" responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>LAN Name</th>
                  <th>Size</th>
                  <th>Network IP</th>
                  <th>Gateway IP</th>
                  <th>Last Host IP</th>
                  <th>BroadCast IP</th>
                </tr>
              </thead>
              <tbody>{props.isOpenSubnetsTable && renderTable()}</tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col md="6" className="offset-md-3 mb-5 mt-2">
            <Button color="success" block onClick={makeCsvFile}>
              <span>
                <FontAwesomeIcon icon={faDownload} color="white" />
              </span>
              <span> Download as CSV</span>
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Subnets;
