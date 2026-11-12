import { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import headerImg from "../assets/img/upscalemedia-transformed.png";
import { ArrowRightCircle } from "react-bootstrap-icons";
import "animate.css";
import TrackVisibility from "react-on-screen";

const heroPhrase = "Think. Build. Compete.";

export const Banner = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delay, setDelay] = useState(110);

  const tick = useCallback(() => {
    const nextText = isDeleting
      ? heroPhrase.slice(0, text.length - 1)
      : heroPhrase.slice(0, text.length + 1);

    setText(nextText);

    if (!isDeleting && nextText === heroPhrase) {
      setIsDeleting(true);
      setDelay(1800);
    } else if (isDeleting && nextText.length === 0) {
      setIsDeleting(false);
      setDelay(450);
    } else if (isDeleting) {
      setDelay(55);
    }
  }, [isDeleting, text]);

  useEffect(() => {
    const timer = window.setTimeout(tick, delay);
    return () => window.clearTimeout(timer);
  }, [delay, tick]);

  return (
    <section className="banner" id="home" aria-labelledby="home-title">
      <Container>
        <Row className="align-items-center gy-5">
          <Col xs={12} lg={7}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={`hero-copy ${
                    isVisible ? "animate__animated animate__fadeInUp" : ""
                  }`}
                >
                  <p className="hero-kicker">
                    UIT RGPV <span aria-hidden="true">/</span> DEPARTMENT OF
                    INFORMATION TECHNOLOGY
                  </p>
                  <h1 id="home-title">CodeAdept 10.0</h1>
                  <h2 className="hero-phrase" aria-label="Think. Build. Compete.">
                    <span aria-hidden="true">{text}</span>
                    <span className="typing-cursor" aria-hidden="true" />
                  </h2>
                  <p className="hero-description">
                    A three-round coding competition organised by the
                    Department of Information Technology, UIT RGPV. Open to UIT
                    RGPV students. Individual participation. Free entry.
                  </p>
                  <div className="hero-actions">
                    <Link className="hero-button hero-button-primary" to="/register">
                      Register for CodeAdept 10.0
                      <ArrowRightCircle aria-hidden="true" />
                    </Link>
                    <Link className="hero-button hero-button-secondary" to="/Codeadept">
                      Explore the rounds
                    </Link>
                  </div>
                  <p className="hero-dates">
                    <span>Aptitude · 14 Nov 2026</span>
                    <span>DSA · 19 Nov 2026</span>
                    <span>Final · 23 Nov 2026</span>
                  </p>
                </div>
              )}
            </TrackVisibility>
          </Col>
          <Col xs={12} lg={5}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={`hero-art ${
                    isVisible ? "animate__animated animate__zoomIn" : ""
                  }`}
                >
                  <div className="hero-art-frame">
                    <img src={headerImg} alt="Abstract coding illustration" />
                  </div>
                  <p className="hero-art-caption">CODEADEPT / UIT RGPV</p>
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
