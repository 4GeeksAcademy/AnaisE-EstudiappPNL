import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">EstudiApp</span>
				</Link>
				<div className="ml-auto">
					<Link to="/register">
						<button className="btn btn-primary">Registro</button>
					</Link>
					<Link to="/login">
						<button className="btn btn-primary">Ingreso</button>
					</Link> 
					
				</div>
			</div>
		</nav>
	);
};
