import React from "react";
import "./info.css";

const rounds = [
  {
    number: "01",
    name: "Aptitude Round",
    date: "15 November 2026",
    time: "6:00 PM",
    mode: "Online",
  },
  {
    number: "02",
    name: "DSA Round",
    date: "17 November 2026",
    mode: "Offline",
    venue: "IT Department",
  },
  {
    number: "03",
    name: "DSA Final Round",
    date: "19 November 2026",
    mode: "Offline",
    venue: "IT Department",
  },
];

const Info = () => (
  <section className="info-section" aria-labelledby="competition-title">
    <header className="competition-heading">
      <p className="competition-kicker">THE COMPETITION</p>
      <h2 id="competition-title">Three rounds. One challenge.</h2>
      <p>
        CodeAdept 10.0 is organised by the Department of Information
        Technology, UIT RGPV.
      </p>
    </header>

    <div className="rounds">
      {rounds.map((round) => (
        <article className="round-card card" key={round.number}>
          <span className="round-number">ROUND {round.number}</span>
          <h3 className="round-title">{round.name}</h3>
          <p className="round-detail">{round.date}</p>
          {round.time && <p className="round-detail">{round.time}</p>}
          <p className="round-detail">{round.mode}</p>
          {round.venue && <p className="round-detail">{round.venue}</p>}
        </article>
      ))}
    </div>
  </section>
);

export default Info;
