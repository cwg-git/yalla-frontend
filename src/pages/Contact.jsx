import LegacyBlock from '../components/LegacyBlock';
import ContactUs from '../images/contact-us.webp';

const Contact = () => {
    return (
        <div>
            <section className="inner-banner">
                <div className="container">
                    <div className="text-block">
                        <h3><em>Contact</em></h3>
                        <h1><em>Yalla Lebanon</em></h1>
                    </div>
                </div>
            </section>
            <section className="about-us">
                <div className="container">
                    <div className="title-block text-center">
                        <h2>Get in Touch</h2>
                        <p>Have a question or feedback? Reach out to us and we will be happy to assist you.</p>
                    </div>
                    <div className="contact-sec">
                        <div className="row">
                            <div className="col-lg-6 col-md-12">
                                <div className="lt-block">
                                    <div className="img-block position-relative">
                                        <img src={ContactUs} alt="Contact Us" />
                                    </div>
                                    <h3>Contact Us</h3>
                                    <ul>
                                        <li>
                                            <h4>Phone</h4>
                                            <p><a href="tel:+34674811645">+34674811645</a></p>
                                        </li>
                                        <li>
                                            <h4>Email</h4>
                                            <p><a href="mailto:faoualabi@gmail.com">faoualabi@gmail.com</a></p>
                                        </li>
                                        <li>
                                            <h4>Address</h4>
                                            <p>98 carrer marina 08018 barcelona </p>
                                        </li>
                                        <li>
                                            <h4>Follow Us </h4>
                                            <div className="socila">
                                                <a href="https://www.facebook.com/YallaLebanondotcom/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook-f" /></a>
                                                <a href="https://www.instagram.com/yallalebanon_com/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram" /></a>
                                                <a href="https://x.com/i/flow/login?redirect_after_login=%2FYallaLebanon" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-x-twitter" /></a>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <div className="rt-block">
                                    <h3>Send a Message</h3>
                                    <form>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <p>First Name <span className="text-danger">*</span></p>
                                                    <input className="form-control" type="text" placeholder="First Name" name />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <p>Last Name <span className="text-danger">*</span></p>
                                                    <input className="form-control" type="text" placeholder="Last Name" name />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <p>Email Address<span className="text-danger">*</span></p>
                                                    <input className="form-control" type="text" placeholder="Email Address" email address />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <p>Message</p>
                                                    <textarea className="form-control" placeholder="Message" defaultValue={""} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="btn"><input className="button-submit" type="button" name defaultValue="Submit" /></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <LegacyBlock />
        </div>
    );
};
export default Contact;
