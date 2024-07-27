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
                                <a className="nav-link" style={{ color: '#333', fontSize: '1.2em' }} href="/">
                                    &#x1F3E0; Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" style={{ color: '#333', fontSize: '1.2em' }} href="/AddFunds">
                                    &#x1F4B5; Add Campaign
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" style={{ color: '#333', fontSize: '1.2em' }} href="/AboutUs">
                                    &#x1F465; About Us
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" style={{ color: '#333', fontSize: '1.2em' }} href="/ContactUs">
                                    &#x1F4E9; Contact Us
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
