import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";

// let isListenerAdded = false;

function Header({ children, isAdmin }) {
  const [isClient, setIsClient] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const isActive = (path) => {
    if (typeof window === "undefined") return false; // Evita erros no lado do servidor
    return isClient && window.location.pathname === path;
  };

  const handleMouseEnter = (dropdown) => {
    setOpenDropdown(dropdown);
  };

  return (
    <div className="fundo">
      <Navbar
        expand="sm"
        className="custom-navbar"
      >
        <Container className="container-navbar">
          <Navbar.Brand style={{ display: "flex", alignItems: "center" }}>
            <Image
              alt="Logo Cartão de Todos"
              src="/imgs/logo-lailla.png"
              width="140"
              height="50"
              className="d-inline-block align-top logo-lailla"
              style={{
                userSelect: "none",
                pointerEvents: "none",
                margin: "-10px",
              }}
            />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="custom-toggle"
          />
          <Navbar.Collapse>
            <Nav ref={dropdownRef}>
              <Nav.Link as="span">
                <Link
                  href="/macros/macros"
                  className={`nav-link ${isActive("/macros/macros") ? "active" : ""
                    }`}
                >
                  Etapas
                </Link>
              </Nav.Link>

              <NavDropdown
                className="dropdownNav"
                title="Contato"
                show={openDropdown === "contato"}
                onMouseEnter={() => handleMouseEnter("contato")}
              >
                <NavDropdown.Item as="span">
                  <Link
                    href="/contact/client"
                    className={`dropdown-item nav-link ${isActive("/contact/client") ? "active" : ""}`}
                  >
                    Cliente
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item as="span">
                  <Link
                    href="/contact/address"
                    className={`dropdown-item nav-link ${isActive("/contact/address") ? "active" : ""}`}
                  >
                    Endereço
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item as="span">
                  <Link
                    href="/contact/marketing"
                    className={`dropdown-item nav-link ${isActive("/contact/marketing") ? "active" : ""}`}
                  >
                    Marketing
                  </Link>
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as="span">
                <Link
                  href="/services/sales"
                  className={`nav-link ${isActive("/services/sales") ? "active" : ""}`}
                >
                  Vendas
                </Link>
              </Nav.Link>
              <Nav.Link as="span">
                <Link
                  href="/services/rejections"
                  className={`nav-link ${isActive("/services/rejections") ? "active" : ""}`}
                >
                  Objeções
                </Link>
              </Nav.Link>
              {/* <NavDropdown
                className="dropdownNav"
                title="Vendas"
                show={openDropdown === "sales"}
                onMouseEnter={() => handleMouseEnter("sales")}
              >
                <NavDropdown.Item as="span">
                  <Link
                    href="/sales/services"
                    className={`dropdown-item nav-link ${isActive("/sales/services") ? "active" : ""}`}
                  >
                    Vendas
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item as="span">
                  <Link
                    href="/sales/rejections"
                    className={`dropdown-item nav-link ${isActive("/sales/rejections") ? "active" : ""}`}
                  >
                    Vendas Perdidas
                  </Link>
                </NavDropdown.Item>
              </NavDropdown> */}
              <Nav.Link as="span">
                <Link
                  href="/timeline"
                  className={`menu-linha-tempo nav-link ${isActive("/timeline") ? "active" : ""}`}
                >
                  Linha do Tempo
                </Link>
              </Nav.Link>
              <div style={{ flex: 1 }} />
              {isAdmin && (
                <Nav.Link as="span">
                  <Link
                    href="/configurations/configurations"
                    className="nav-link"
                    title="Configurações"
                    style={{ display: "flex", alignItems: "center", height: "100%" }}
                  >
                    <i className="pi pi-cog" style={{ fontSize: 18 }} />
                  </Link>
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main>{children}</main>
    </div>
  );
}

export default Header;
