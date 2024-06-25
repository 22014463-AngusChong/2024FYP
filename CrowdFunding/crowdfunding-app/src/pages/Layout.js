import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>     
                    <li>
                        <Link to="/AddFunds">AddFunds</Link>
                    </li>               
                    <li>
                        <Link to="/AboutUs">AboutUs</Link>
                    </li>
                    <li>
                        <Link to="/ContactUs">ContactUs</Link>
                    </li>

                </ul>
            </nav>
            <Outlet />
        </>
    )
};

export default Layout;
