import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import colorSharp2 from "../assets/img/color-sharp2.png";
import "./Timeline.css";

const timelineData = [
  {
    date: "15 November 2026",
    title: "Aptitude Round",
    time: "6:00 PM",
    mode: "Online",
  },
  {
    date: "17 November 2026",
    title: "DSA Round",
    mode: "Offline",
    venue: "IT Department",
  },
  {
    date: "19 November 2026",
    title: "DSA Final Round",
    mode: "Offline",
    venue: "IT Department",
  },
];

export const Timeline = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.3 }
    );

    document
      .querySelectorAll(".timeline-card-wrapper")
      .forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="timeline-section" id="timeline">
      <Container>
        <Row>
          <Col size={12}>
            <h2 className="timeline-title">Event timeline</h2>
            <div className="timeline-cards">
              {timelineData.map((round, index) => (
                <div
                  key={round.date}
                  className={`timeline-card-wrapper ${
                    index % 2 === 0 ? "odd" : "even"
                  }`}
                >
                  <article className="timeline-card">
                    <p className="timeline-date">{round.date}</p>
                    {round.time && <p className="timeline-card-text">{round.time}</p>}
                    <h3 className="timeline-card-title">{round.title}</h3>
                    <p className="timeline-card-text">{round.mode}</p>
                    {round.venue && (
                      <p className="timeline-card-text">{round.venue}</p>
                    )}
                  </article>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2} alt="" />
    </section>
  );
};
