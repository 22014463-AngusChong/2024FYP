import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";

class NavBar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: 'lightgrey' }}>
                <div className="container">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav w-100 d-flex justify-content-between">
                            <li className="nav-item flex-grow-1 text-center">
                                <a className="nav-link active" style={{ color: 'black' }} href="/">Home</a>
                            </li>
                            <li className="nav-item flex-grow-1 text-center">
                                <a className="nav-link active" style={{ color: 'black' }} href="/AddFunds">Add Funds</a>
                            </li>
                            <li className="nav-item flex-grow-1 text-center">
                                <a className="nav-link active" style={{ color: 'green', textDecoration: 'none', fontSize: '1.5em', fontWeight: 'bold' }}>GetFund</a>
                            </li>
                            <li className="nav-item flex-grow-1 text-center">
                                <a className="nav-link active" style={{ color: 'black' }} href="/AboutUs">About Us</a>
                            </li>
                            <li className="nav-item flex-grow-1 text-center">
                                <a className="nav-link active" style={{ color: 'black' }} href="/ContactUs">Contact Us</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBar;
