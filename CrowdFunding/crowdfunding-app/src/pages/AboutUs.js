const AboutUs = () => {
    const aboutUsStyle = {
        textAlign: "center",
        fontSize: "1.2em",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px"
    };

    return (
        <div style={aboutUsStyle}>
            <h1>Welcome to our Decentralized Crowdfunding Platform, where innovation meets opportunity on the blockchain.</h1>
            <p>
                Our mission is to empower creators and backers by providing a transparent, secure, and inclusive space to fund and support visionary projects. 
                Utilizing cutting-edge decentralized technology, we eliminate intermediaries, ensuring that your contributions reach their destination efficiently and with full accountability. 
                Join us in revolutionizing the future of crowdfunding!
            </p>
        </div>
    );
};

export default AboutUs;
