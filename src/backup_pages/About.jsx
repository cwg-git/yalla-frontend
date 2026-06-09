import React from 'react';
import LegacyBlock from '../components/LegacyBlock';
import DiscoverLebanonAbout from '../images/Discover-Lebanon-about.webp';
import DiscoverLebanonAboutImage from '../images/Discover-Lebanon-about-image.webp';
import OurValues from '../images/Our-Values.webp';
import OurVision from '../images/Our-Vision.webp';
import OurMission from '../images/Our-Mission.webp';
import CoreValues from '../images/Core-Values.webp';
const About = () => {
    return (
        <div>
            <div>
                <section className="inner-banner">
                    <div className="container">
                        <div className="text-block">
                            <h3><em>About</em></h3>
                            <h1><em>Yalla Lebanon</em></h1>
                        </div>
                    </div>
                </section>
                <section className="about-us">
                    <div className="container">
                        <div className="title-block text-center">
                            <h2>Discover Lebanon’s Events</h2>
                            <p>Immerse yourself in Lebanon’s vibrant event scene with yallalebanon.com</p>
                        </div>
                        <div className="md-block">
                            <div className="row">
                                <div className="col-lg-6 col-md-12">
                                    <div className="img-block">
                                        <img src={DiscoverLebanonAbout} alt="Discover Lebanon" />
                                        <img src={DiscoverLebanonAboutImage} alt="Lebanon About" />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-12">
                                    <div className="text-block">
                                        <h3>Our Story</h3>
                                        <p>With years of experience in event planning and promotion, yallalebanon.com has become the go-to platform for event enthusiasts in Lebanon. From small local gatherings to large-scale festivals, we have successfully catered to a wide range of clients and helped them create unforgettable experiences for their attendees. Our expertise, combined with our passion for events, drives us to deliver the most comprehensive event guide in the country.</p>
                                        <ul>
                                            <li>Comprehensive Event Guide</li>
                                            <li>Stay Updated on Latest Events</li>
                                            <li>Wide Range of Event Categories</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bottom-block">
                            <div className="row">
                                <div className="col-md-6 col-lg-3">
                                    <div className="box">
                                        <img src={OurValues} alt="Our Values" />
                                        <h4>Our Values</h4>
                                        <p>At yallalebanon.com, we believe in upholding a strong set of values that guide our work and interactions.</p>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-3">
                                    <div className="box">
                                        <img src={OurVision} alt="Our Vision" />
                                        <h4>Our Vision</h4>
                                        <p>To be the top online platform for event enthusiasts in Lebanon, providing the most extensive and user-friendly event guide.</p>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-3">
                                    <div className="box">
                                        <img src={OurMission} alt="Our Mission" />
                                        <h4>Our Mission</h4>
                                        <p>To connect event-goers with their favorite events and help organizers reach their target audience through our innovative platform.</p>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-3">
                                    <div className="box">
                                        <img src={CoreValues} alt="Core Values" />
                                        <h4>Core Values</h4>
                                        <p>We value inclusivity, integrity, creativity, and excellence in everything we do.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section></div>
            
            <LegacyBlock />
        </div>

    );
};
export default About;
