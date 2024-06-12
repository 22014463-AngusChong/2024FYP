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
                            <a className="nav-link active" style={{ color: 'black' }} href="/AboutUs">About Us</a>
                        </div>
                        <div className="nav-item logo">
                            <img src="logo-crowdfunding.png" width="100" height="auto" alt="Logo" />
                        </div>
                        <div className="nav-item">
                        
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBar;
