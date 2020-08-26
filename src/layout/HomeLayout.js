import React, { useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';

import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Input,
  Alert,
} from 'reactstrap';

import { notifyErrorBC } from '../utils/Notifier';

import '../main.css';

const HomeLayout = (props) => {
  let history = useHistory();
  const [ispNet, setIspNet] = useState('');

  const [ispIP, setIspIP] = useState('');
  const [ispSubnet, setIspSubnet] = useState('');

  const [validNetAddress, setValidNetAddress] = useState(true);

  const isHostPartCorrect = (binaryIP, subnet) => {
    for (let i = subnet; i < 32; i++) {
      // checking host bits are '0'
      if (binaryIP[i] === '1') {
        setValidNetAddress(false);
        return false;
      }
    }
    return true;
  };

  const validateIspIP = () => {
    let isValid = /([0-9./])$/.test(ispNet);
    if (isValid) {
      let ip = ispNet.split('/')[0];
      let subnet = ispNet.split('/')[1];
      if (ip && subnet && ip.split('.').length - 1 === 3) {
        let binaryIP = [];
        ip.split('.').map((oct) => {
          oct = oct * 1;
          // converting each octate into binary
          // setting prefix of each octate with '0's if needed
          binaryIP.push(oct.toString(2).padStart(8, '0'));
        });
        binaryIP = binaryIP.join('');
        // console.log(binaryIP);
        setValidNetAddress(true);
        // checking the network bits and host bits are valid or invalid
        if (isHostPartCorrect(binaryIP, subnet)) {
          sessionStorage.setItem('ispBinaryIP', binaryIP); // saving the binaryIP in coockies
          sessionStorage.setItem('ispIP', ip); // saving isp ip in coockies
          sessionStorage.setItem('subnet', subnet); // saving subnet in coockies

          setIspIP(ip);
          setIspSubnet(subnet);

          history.push('/dashboard');
        }
      } else {
        notifyErrorBC(
          'Please Provide a valid Network Address. e.g: 192.168.0.0/24'
        );
      }
    } else {
      notifyErrorBC(
        'Please Provide a valid Network Address. e.g: 192.168.0.0/24'
      );
    }
  };

  const handleValidateGoButtonAction = (event) => {
    event.preventDefault();
    if (ispNet) validateIspIP();
  };

  const redirection = () => {
    // if (validNetAddress && ispIP !== '' && ispSubnet !== '') {
    //   return <Redirect to="/dashboard" />;
    // } else {
    return (
      <div>
        <Container
          className="p-2 themed-container bg-secondary"
          fluid
        ></Container>
        <Container className="themed-container homeContainer bg-dark" fluid>
          <Row>
            <Col md="6" className="offset-md-3">
              <Form className="homeContainer-form">
                <h4 className="text-light bg-dark text-center">
                  ISP Provided Network Address in CIDR notation (a.b.c.d/mask)
                </h4>
                <FormGroup>
                  <Input
                    className="text-center"
                    type="text"
                    name="ip"
                    placeholder="e.g: 192.168.0.0/24"
                    invalid={!validNetAddress}
                    onChange={(event) => setIspNet(event.target.value)}
                  />
                </FormGroup>

                <Button
                  color="info"
                  block
                  className="text-uppercase"
                  onClick={handleValidateGoButtonAction}
                >
                  Validate & GO
                </Button>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col md="6" className="offset-md-3 mt-5">
              <Alert color="danger" isOpen={!validNetAddress}>
                Please Provide a valid Network Address!
              </Alert>
            </Col>
          </Row>
        </Container>
      </div>
    );
  };
  // };

  return redirection();
};

export default HomeLayout;
