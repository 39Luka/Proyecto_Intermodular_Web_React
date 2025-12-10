import Nav from "./Nav.jsx";

function Header() {
  return (
    <header className="main-header">
      <div className="header-container">
        <h1 className="logo">Mi Logo</h1>
        <Nav />
      </div>
    </header>
  );
}

export default Header;
