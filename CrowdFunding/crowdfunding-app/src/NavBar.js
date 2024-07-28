import React from 'react';

const NavBar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: 'lightgrey' }}>
            <div className="container d-flex justify-content-between align-items-center">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav w-100 d-flex justify-content-between align-items-center">
                        <li className="nav-item">
                            <a className="nav-link active" style={{ color: 'black' }} href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" style={{ color: 'black' }} href="/AddFunds">Add Funds</a>
                        </li>
                        <div className="nav-item logo">
                            <a className="nav-item logo" style={{ color: 'green', textDecoration: 'none' }}>
                                <b>GetFund </b>
                            </a>
                        </div>
                        <li className="nav-item dropdown">
                            <a className="nav-link active" style={{ color: 'black' }} href="/AboutUs">About Us</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" style={{ color: 'black' }} href="/ContactUs">Contact Us</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" style={{ color: 'black' }} href="/MemberClub">Member Club</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" style={{ color: 'black' }} href="/Campaigns">Campaigns</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
