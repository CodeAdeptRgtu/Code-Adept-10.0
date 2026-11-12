import { Container, Row, Col } from "react-bootstrap";
import { FaLinkedin, FaTwitter, FaInstagram, FaWhatsapp } from "react-icons/fa";
import logo from "../assets/img/DoIT .png";
import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="footer-row align-items-center justify-content-between">
          {/* Logo */}
          <Col xs={12} md={3} className="footer-logo text-center text-md-start">
            <img src={logo} alt="Logo" />
          </Col>

          {/* Contact Info */}
          <Col
            xs={12}
            md={4}
            className="footer-contact text-center text-md-start"
          >
            <p>
              Mobile: <a href="tel:+919981922559">+91 9981922559, 7389684784</a>
            </p>
            <p>
              Email:{" "}
              <a href="mailto:codeadept@doitcoding.club">
                codeadept@doitcoding.club
              </a>
            </p>
          </Col>

          {/* Social Icons */}
          <Col xs={12} md={3} className="footer-social text-center text-md-end">
            <div className="social-icon">
              <a
                href="https://www.linkedin.com/showcase/codeadept"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://x.com/codeadept_"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.instagram.com/codeadept/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://chat.whatsapp.com/Ekfw7AoO4sC0IkOvIxZzMW"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-icon"
              >
                <FaWhatsapp />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
