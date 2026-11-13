import "./Winners.css";

const winners = [
  {
    place: "FIRST PLACE",
    name: "Deepak Kumar Singh",
    image: "/images/winners/first-place.jpeg",
    medal: "🥇",
    className: "winner-card-first",
  },
  {
    place: "SECOND PLACE",
    name: "Yash Panchal",
    image: "/images/winners/second-place.jpeg",
    medal: "🥈",
    className: "winner-card-second",
  },
  {
    place: "THIRD PLACE",
    name: "Anush Vishwakarma",
    image: "/images/winners/third-place.jpeg",
    medal: "🥉",
    className: "winner-card-third",
  },
];

const Winners = () => (
  <section className="winners-section" aria-labelledby="winners-title">
    <div className="winners-container">
      <header className="winners-heading">
        <p className="winners-eyebrow">CODEADEPT 9.0</p>
        <h2 id="winners-title">PREVIOUS YEAR&apos;S CHAMPIONS</h2>
        <p className="winners-subtitle">
          Celebrating the winners of CodeAdept 9.0
        </p>
      </header>

      <div className="winners-grid">
        {winners.map((winner) => (
          <article
            className={`winner-card ${winner.className}`}
            key={winner.place}
          >
            <div className="winner-image-frame">
              <img src={winner.image} alt={winner.name} loading="lazy" />
            </div>
            <div className="winner-details">
              <p className="winner-place">
                <span aria-hidden="true">{winner.medal}</span>
                {winner.place}
              </p>
              <h3>{winner.name}</h3>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Winners;
