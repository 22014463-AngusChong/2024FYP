import React, { Component } from 'react';
import Layout from "./pages/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";

class NavBar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: 'lightgreen' }}>
                <div className="container d-flex justify-content-center align-items-center">
                    <div className="navbar-nav w-100 d-flex justify-content-between align-items-center">
                        <div className="nav-item d-none d-lg-block">
                            <a className="nav-link active" style={{ color: 'black' }} href="/">Home</a>
                            <a className="nav-link active" style={{ color: 'black' }} href="/AddFunds">Add Fund</a>
                        </div>
                        <div className="nav-item logo">
                        <a href="/">
                                <img src="logo-crowdfunding.png" width="200" height="200" alt="Logo" />
                            </a>
                        </div>
                        <div className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle active" style={{ color: 'black' }} href="/AboutUs" id="aboutUsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                About Us
                            </a>
                            {/* <ul className="dropdown-menu" aria-labelledby="aboutUsDropdown">
                                <li><a className="dropdown-item" href="/AboutUs/OurTeam">Our Team</a></li>
                                <li><a className="dropdown-item" href="/AboutUs/OurStory">Our Story</a></li>
                                <li><a className="dropdown-item" href="/AboutUs/Careers">Careers</a></li>
                            </ul> */}
                            <a className="nav-link active" style={{ color: 'black' }} href="/ContactUs">Contact Us</a>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBar;

