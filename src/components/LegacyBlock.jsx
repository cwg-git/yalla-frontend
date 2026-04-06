import React from 'react';
import BoxBg1 from '../images/box-bg1.webp';
import BoxBg2 from '../images/box-bg2.webp';
import BoxBg3 from '../images/box-bg3.webp';
const LegacyBlock = () => {
    return (
        <section className="legacy-block">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-3 col-sm-12">
                        <div className="button-block"><a className="legacy-btn" href="/legacy">Lebanese Legacy</a></div>
                    </div>
                    <div className="col-lg-3 col-sm-4 col-xs-4">
                        <div className="legacy-box">
                            <a href="/yesterday">
                                <img src={BoxBg1} alt="Yesterday" />
                            </a>
                            <h3>
                                <a href="/yesterday">Yesterday</a>
                            </h3>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-4 col-xs-4">
                        <div className="legacy-box">
                            <a href="/today">
                                <img src={BoxBg2} alt="Today" />
                            </a>
                            <h3>
                                <a href="/today">Today</a>
                            </h3>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-4 col-xs-4">
                        <div className="legacy-box">
                            <a href="/legacy/forever">
                                <img src={BoxBg3} alt="Forever" />
                            </a>
                            <h3>
                                <a href="/legacy/forever">Forever</a>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LegacyBlock;


