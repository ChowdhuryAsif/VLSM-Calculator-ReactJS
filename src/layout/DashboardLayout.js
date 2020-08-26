import React, { useState } from 'react';
import { Link } from 'react-scroll';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Input,
  Alert,
  Label,
  Table,
} from 'reactstrap';

import { uploadFile } from '../utils/GNS3Utility';
import { notifySuccess, notifyWarning, notifyError } from '../utils/Notifier';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faPlus,
  faRedoAlt,
  faSitemap,
  faList,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';

import Subnets from '../components/Subnets';

import '../main.css';

const DashboardLayout = () => {
  // const ispBinaryIP = sessionStorage.getItem('ispBinaryIP');
  const ispIP = sessionStorage.getItem('ispIP');
  const ispSubnet = sessionStorage.getItem('subnet');

  const [lanName, setLanName] = useState('');
  const [hostNumber, setHostNumber] = useState('');
  const [lans, setLans] = useState([]);

  const [file, setFile] = useState('');
  const [fileName, setFileName] = useState('Chosse File');

  let availableSpace = Math.pow(2, 32 - ispSubnet);

  const [isOpenSubnetsTable, setIsOpenSubnetsTable] = useState(false);

  // console.log(lanName, hostNumber);

  const getNormalizedLan = (id, name, hostNumber) => {
    return {
      id,
      name,
      hostNumber: hostNumber * 1,
      // size = required power of 2 to satisfy the hostNumber
      size: Math.ceil(Math.log2(hostNumber * 1 + 2)),
    };
  };

  const handleAddButtonAction = (event) => {
    event.preventDefault();
    if (lanName) {
      let isValid = /([0-9])$/.test(hostNumber);
      if (isValid) {
        let lan = getNormalizedLan(lans.length + 1, lanName, hostNumber);

        if (getTotalNetworkSize([...lans, lan]) <= availableSpace) {
          setLans([...lans, lan]);
          clearForm();
          // console.log(lans);
          if (isOpenSubnetsTable) setIsOpenSubnetsTable(false);
          notifySuccess('Successfully Added.');
        } else {
          notifyWarning('Not enough available space to accommodate this LAN');
        }
      } else {
        notifyError('Host Number must be a Number!');
      }
    } else {
      notifyError('Please declare a LAN name!');
    }
  };

  const getTotalNetworkSize = (lanList) => {
    console.log(lanList);
    let sum = 0;
    for (let i = 0; i < lanList.length; i++) {
      sum += lanList[i].hostNumber + 2;
    }
    if (lanList.length > 2) sum += lanList.length * 4;
    else if (lanList.length === 2) sum += 4;

    sum = Math.pow(2, Math.ceil(Math.log2(sum)));
    return sum;
  };

  const fileBrowseHandler = (event) => {
    setFile(event.target.files);
    setFileName(event.target.files[0].name);
  };

  const fileUploadHandler = async () => {
    const lanList = await uploadFile(file);

    let tempLans = [];
    for (let i = 0; i < lanList.length; i++) {
      let lan = getNormalizedLan(i + 1, lanList[i].name, lanList[i].hostNumber);
      tempLans.push(lan);
    }
    if (getTotalNetworkSize(tempLans) <= availableSpace) {
      setLans(tempLans);
      if (isOpenSubnetsTable) setIsOpenSubnetsTable(false);
      notifySuccess('Successfully Uploaded.');
    } else {
      notifyWarning('Not enough space to apply VLSM!');
    }
    //console.log(file);
  };

  // console.log(lans);

  const renderTable = () => {
    const lanList = lans.map((lan) => {
      return (
        <tr key={lan.id}>
          <th scope="row">{lan.id}</th>
          <td>{lan.name}</td>
          <td>{lan.hostNumber}</td>
        </tr>
      );
    });
    return lanList;
  };

  const clearForm = () => {
    setLanName('');
    setHostNumber('');
  };

  const resetAll = (event) => {
    event.preventDefault();
    clearForm();
    setLans([]);
    setFile('');
    setFileName('Choose File');
    setIsOpenSubnetsTable(false);
  };

  return (
    <div>
      <Container className="pt-2 themed-container bg-secondary" fluid>
        <Row>
          <Col md="6" className="text-center">
            <h5>
              <span className="text-warning">ISP IP Address:</span>{' '}
              <span className="text-light">
                {ispIP}/{ispSubnet}
              </span>
            </h5>
          </Col>
          <Col md="6" className="text-center">
            <h5>
              <span className="text-warning">Available Space:</span>{' '}
              <span className="text-light">{availableSpace}</span>
            </h5>
          </Col>
        </Row>
      </Container>
      <Container className="themed-container mt-3" fluid>
        <Row>
          <Col md="6" className="text-light">
            <h4 className="mb-5">
              <span>
                <FontAwesomeIcon icon={faSitemap} color="#6c757d" />
              </span>
              <span> Give Subnets Information</span>
            </h4>
            <Form className="dashboard-form">
              <FormGroup row>
                <Label htmlFor="lanName" md={4} className="text-warning">
                  <h5>LAN Name:</h5>
                </Label>
                <Col>
                  <Input
                    className="bg-dark text-light dashboard-form-lan-inputField"
                    type="text"
                    name="lanName"
                    placeholder="A LAN Name"
                    value={lanName}
                    onChange={(event) => setLanName(event.target.value)}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label htmlFor="hostNumber" md={4} className="text-warning">
                  <h5>Number of Hosts:</h5>
                </Label>
                <Col>
                  <Input
                    className="bg-dark text-light dashboard-form-lan-inputField"
                    type="number"
                    name="hostNumber"
                    placeholder="15"
                    value={hostNumber}
                    onChange={(event) => setHostNumber(event.target.value)}
                  />
                </Col>
              </FormGroup>
              <Row>
                <Col md="4"></Col>
                <Col>
                  <Row>
                    <Col md="4">
                      <Button
                        color="success"
                        block
                        className="dashboard-form-btn dashboard-form-btn-add"
                        onClick={handleAddButtonAction}
                      >
                        <span>
                          <FontAwesomeIcon icon={faPlus} />
                        </span>
                        <span> ADD</span>
                      </Button>
                    </Col>
                    <Col md="4">
                      <Button
                        color="warning"
                        block
                        className="dashboard-form-btn dashboard-form-btn-clear"
                        onClick={clearForm}
                      >
                        <span>
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                        <span> CLEAR</span>
                      </Button>
                    </Col>
                    <Col md="4">
                      <Button
                        color="secondary"
                        block
                        className="dashboard-form-btn dashboard-form-btn-reset"
                        onClick={resetAll}
                      >
                        <span>
                          <FontAwesomeIcon icon={faRedoAlt} />
                        </span>
                        <span> RESET</span>
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>

            <Row>
              <Col className="text-light">
                <h4 className="mb-4 mt-5">
                  <span>
                    <FontAwesomeIcon icon={faUpload} color="#6c757d" />
                  </span>
                  <span> Upload GNS3 Topology</span>
                </h4>
                <Form className="mb-5">
                  <FormGroup>
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="customFile"
                        onChange={fileBrowseHandler}
                      />
                      <label
                        className="custom-file-label bg-dark text-light"
                        htmlFor="customFile"
                      >
                        {fileName}
                      </label>
                    </div>
                  </FormGroup>
                  <Row>
                    {/* md="8" className="offset-md-2" */}
                    <Col>
                      <Button
                        color="success"
                        className="text-light"
                        block
                        onClick={fileUploadHandler}
                      >
                        <span>
                          <FontAwesomeIcon icon={faUpload} color="white" />
                        </span>
                        <span> UPLOAD</span>
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Col>
          <Col md="6" className="text-light text-center">
            <h4 className="mb-4">
              <span>
                <FontAwesomeIcon icon={faList} color="#6c757d" />
              </span>
              <span> LAN Information</span>
            </h4>
            <Row>
              <Col className="mb-5">
                <div className="lan-table">
                  <h6 className="text-warning text-left">
                    <em>
                      *Router-to-Router total host number:{' '}
                      {lans.length > 1
                        ? lans.length > 2
                          ? lans.length * 4
                          : 4
                        : 0}
                    </em>
                  </h6>
                  <Table dark className="table-striped table-sm">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>LAN Name</th>
                        <th>Size</th>
                      </tr>
                    </thead>
                    <tbody>{renderTable()}</tbody>
                  </Table>
                </div>
                <div className="mt-3">
                  <Row>
                    {/* md="6" className="offset-md-3" */}
                    <Col>
                      <Link to="subnetAllocation" smooth={true} duration={1000}>
                        <Button
                          color="success"
                          className="text-light"
                          block
                          onClick={() =>
                            lans.length && setIsOpenSubnetsTable(true)
                          }
                        >
                          <span>
                            <FontAwesomeIcon icon={faSitemap} color="white" />
                          </span>
                          <span> Calculate Subnet Allocation</span>
                        </Button>
                      </Link>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <Container className="themed-container" fluid>
        <Subnets lans={lans} isOpenSubnetsTable={isOpenSubnetsTable} />
      </Container>
    </div>
  );
};

export default DashboardLayout;
