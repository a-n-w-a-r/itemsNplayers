import { Outlet, Link, NavLink } from "react-router-dom";
import './Layout.css'

const Layout = () => {
    return (
        <>
            <nav className="navbar">
                <ul className="nav-list">
                    <li>
                        <NavLink to = "/" className="nav-link">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to = "/player" className="nav-link">Players</NavLink>
                    </li>
                    <li>
                        <NavLink to = "/item" className="nav-link">Item</NavLink>
                    </li>
                    <li>
                        <NavLink to = "/link" className="nav-link">Link</NavLink>
                    </li>
                </ul>
                
            </nav>
            <Outlet />
        </>
    )
}

export default Layout