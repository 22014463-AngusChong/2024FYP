import React, { Component } from 'react';
import Layout from "./pages/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
class NavBar extends Component {
    render() {
        return (
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <img src="/images/petshop.png" width="200" height="200" />
                    <span class="navbar-brand mb-0 h1">Crowdfunding Platform </span>
                    <a class="nav-link active" href="/">Home</a>
                    <a class="nav-link active" href="/AddFunds">Add Fund</a>
                    <a class="nav-link active" href="/AboutUs">About Us</a>
                    <p class="nav-link" href="#"> Projects: <span id="account"> {this.props.account} </span> </p>
                </div>
            </nav>
        )
    }
}
export default NavBar;