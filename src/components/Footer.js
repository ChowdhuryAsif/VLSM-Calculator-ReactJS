import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithubSquare,
  faFacebookSquare,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <Container
      className="p-2 fixed-bottom themed-container text-light bg-secondary text-center"
      fluid
    >
      <Row>
        <Col md="6" className="offset-md-3">
          <FontAwesomeIcon icon={faLayerGroup} color="white" />
          <span> Developed by </span>
          <span>
            <b>ChowdhuryAsif</b>
          </span>
          <span>
            &nbsp;&nbsp;
            <a
              href="https://github.com/ChowdhuryAsif"
              target="_blank"
              className="text-light font-weight-bold"
            >
              <FontAwesomeIcon icon={faGithubSquare} color="white" />
            </a>
          </span>
          <span>
            &nbsp;&nbsp;
            <a
              href="https://www.linkedin.com/in/asifahmedchowdhury/"
              target="_blank"
              className="text-light font-weight-bold"
            >
              <FontAwesomeIcon icon={faLinkedin} color="white" />
            </a>
          </span>
          <span>
            &nbsp;&nbsp;
            <a
              href="https://www.facebook.com/ChowdhuryAsif35/"
              target="_blank"
              className="text-light font-weight-bold"
            >
              <FontAwesomeIcon icon={faFacebookSquare} color="white" />
            </a>
          </span>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
