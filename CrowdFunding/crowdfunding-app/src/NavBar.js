import React, { Component } from 'react';

class NavBar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#e0e0e0', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '10px 20px' }}>
                <div className="container">
                    <a className="navbar-brand mx-auto" style={{ color: 'green', fontSize: '1.8em', fontWeight: 'bold' }} href="/">
                        GetFund
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link" style={{ color: '#333', fontSize: '1.2em', display: 'flex', alignItems: 'center' }} href="/">
                                    <span role="img" aria-label="home" style={{ marginRight: '5px' }}>🏠</span> Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" style={{ color: '#333', fontSize: '1.2em', display: 'flex', alignItems: 'center' }} href="/AddFunds">
                                    <span role="img" aria-label="add campaign" style={{ marginRight: '5px' }}>💵</span> Add Campaign
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" style={{ color: '#333', fontSize: '1.2em', display: 'flex', alignItems: 'center' }} href="/AboutUs">
                                    <span role="img" aria-label="about us" style={{ marginRight: '5px' }}>ℹ️</span> About Us
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" style={{ color: '#333', fontSize: '1.2em', display: 'flex', alignItems: 'center' }} href="/ContactUs">
                                    <span role="img" aria-label="contact us" style={{ marginRight: '5px' }}>📞</span> Contact Us
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" style={{ color: '#333', fontSize: '1.2em', display: 'flex', alignItems: 'center' }} href="/MemberClub">
                                    <span role="img" aria-label="member club" style={{ marginRight: '5px' }}>👥</span> Member Club
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" style={{ color: '#333', fontSize: '1.2em', display: 'flex', alignItems: 'center' }} href="/Campaigns">
                                    <span role="img" aria-label="campaigns" style={{ marginRight: '5px' }}>🎯</span> Campaigns
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBar;

