import React from 'react';

const AboutUs = () => {
    const aboutUsStyle = {
        textAlign: "center",
        fontSize: "1.2em",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px"
    };

    const headerStyle = {
        fontSize: "2em",
        marginBottom: "20px"
    };

    const paragraphStyle = {
        lineHeight: "1.6",
        marginBottom: "20px"
    };

    const imageStyle = {
        width: "100%",
        height: "auto",
        borderRadius: "10px",
        marginBottom: "20px"
    };

    const cardStyle = {
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        padding: "20px",
        marginBottom: "20px",
        textAlign: "left"
    };

    return (
        <div style={aboutUsStyle}>
            <h1 style={headerStyle}>Welcome to our Decentralized Crowdfunding Platform</h1>
            <img src="crowdfunding.jpg" alt="Crowdfunding" style={imageStyle} />
            <p style={paragraphStyle}>
                Our mission is to empower creators and backers by providing a transparent, secure, and inclusive space to fund and support visionary projects.
                Utilizing cutting-edge decentralized technology, we eliminate intermediaries, ensuring that your contributions reach their destination efficiently and with full accountability.
                Join us in revolutionizing the future of crowdfunding!
            </p>
            <div style={cardStyle}>
                <h2>Our Vision</h2>
                <p>
                    To create a global community where innovative ideas can flourish, and everyone has the opportunity to support and benefit from groundbreaking projects.
                </p>
            </div>
            <div style={cardStyle}>
                <h2>Our Values</h2>
                <ul>
                    <li>Transparency</li>
                    <li>Security</li>
                    <li>Inclusivity</li>
                    <li>Innovation</li>
                    <li>Community</li>
                </ul>
            </div>
            <div style={cardStyle}>
                <h2>Why Choose Us?</h2>
                <ul>
                    <li>Decentralized Platform: No intermediaries.Donate to different funds with no worries.</li>
                    <li>Secure Transactions: We use Blockchain.</li>
                    <li>Global Reach: Connect with backers and creators worldwide.</li>
                    <li>Full Accountability: Transparent and trackable contributions. We are able to track history without any information being missed out.</li>
                </ul>
            </div>
        </div>
    );
};

export default AboutUs;
