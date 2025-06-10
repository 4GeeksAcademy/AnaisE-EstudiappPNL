import React from "react";
import logo from "../../img/logo vak.jpg"
import { Link } from "react-router-dom";
import "../../styles/home.css"

export const Navbar = () => {
	return (
		<nav className="navbar">
			<div className="container navbar">
			<img src={logo} alt="" className="logo"/> 
				<Link to="/" className="link">
					<span className="navbar-brand mb-0 h1">EstudiApp</span>
				</Link>
				<div className="ml-auto">
					<Link to="/register">
						<button className="btn btn-primary boton-l">Registro</button>
					</Link>
					<Link to="/login">
						<button className="btn btn-primary boton">Ingreso</button>
					</Link> 
					
				</div>
			</div>
		</nav>
	);
};
