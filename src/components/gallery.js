import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// Winners images
import img1 from "../assets/img/aditi.jpeg";
import img2 from "../assets/img/arpitpathak.jpeg";
import img3 from "../assets/img/abhay.jpeg";
import img4 from "../assets/img/hritik_kumar.png";
import img5 from "../assets/img/anjali_chauhan.png";
import img6 from "../assets/img/ansh_shrivastav.png";
import img7 from "../assets/img/anshuman_prajapati.png";
import img8 from "../assets/img/runjhun_goyal.png";
import img9 from "../assets/img/mayank_ujawane.png";
import img10 from "../assets/img/jayant_patel.jpg";
import img11 from "../assets/img/manav_patel.jpg";
import img12 from "../assets/img/rohit_yadav.jpg";
import shreya from "../assets/img/Shreya_Rai.jpeg";
import dhruv from "../assets/img/Dhruv_Tiwari.jpeg";
import anush from "../assets/img/Anush_Vishwakarma.png";

import photo1 from "../assets/img/photo1.jpg";
import photo2 from "../assets/img/photo2.jpg";
import photo3 from "../assets/img/photo3.jpg";
import photo4 from "../assets/img/photo4.jpg";
import photo5 from "../assets/img/photo5.png";
import photo6 from "../assets/img/photo6.png";

import "./gallery.css";

const Gallery = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
      partialVisibilityGutter: 40,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      partialVisibilityGutter: 30,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 2,
      partialVisibilityGutter: 20,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
      partialVisibilityGutter: 10,
    },
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const galleryImages = [photo5, photo6, photo1, photo2, photo3, photo4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === galleryImages.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  return (
    <div className="gallery">
      {/* Winners Section as Text */}
      <div className="winners">
        <h2 className="winners-text">Past Winners</h2>
      </div>

      <div className="slide">
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          className="winner-carousel"
        >
          {[
            shreya,
            dhruv,
            anush,
            img3,
            img1,
            img2,
            img10,
            img11,
            img12,
            img7,
            img8,
            img9,
            img5,
            img4,
            img6,
          ].map((img, idx) => {
            const names = [
              "Shreya Rai",
              "Dhruv Tiwari",
              "Anush Viswakarma",
              "Abhay Tripathi",
              "Aditi Agrawal",
              "Arpit Pathak",
              "Jayant Patel",
              "Manav Kumar Patel",
              "Rohit Singh Yadav",
              "Anshuman Prajapati",
              "Runjhun Goyal",
              "Mayank Ujawane",
              "Anjali Chauhan",
              "Hritik Kumar",
              "Ansh Shrivastava",
            ];

            const details = [
              "1st IT (8.0)",
              "2nd SOIT (8.0)",
              "3rd CSE (8.0)",
              "IT 3rd (7.0)",
              "CSE 1st (7.0)",
              "CSE 2nd (7.0)",
              "CSE 2nd (6.0)",
              "CSE 1st (6.0)",
              "CSE 3rd (6.0)",
              "IT 3rd (5.0)",
              "IT 1st (5.0)",
              "ECE 2nd (5.0)",
              "CSE 1st (4.0)",
              "CSE 2nd (4.0)",
              "IT 3rd (4.0)",
            ];
            return (
              <div className="winner-detail" key={idx}>
                <img src={img} alt={names[idx]} />
                <h5>{names[idx]}</h5>
                <p>{details[idx]}</p>
              </div>
            );
          })}
        </Carousel>
      </div>

      {/* Photo Gallery */}
      <div className="gallery-strip">
        {galleryImages.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`gallery-slide-${idx}`}
            style={{ display: idx === currentSlide ? "block" : "none" }}
          />
        ))}
      </div>

      {/* Tagline */}
      <div className="line">
        <p>Prepare to Code, Compete, and Conquer at CodeAdept 10.0!</p>
      </div>

      {/* Register Button - Text Only */}
      <div className="btn">
        <Link to="/register">
          <button className="register-btn">Register Now</button>
        </Link>
      </div>
    </div>
  );
};

export default Gallery;
