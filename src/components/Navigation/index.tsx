import Image from "next/image";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar sticky-top navbar-expand-sm navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <Image
            src="/images/DOLLY_imagen.png"
            width="35"
            height="35"
            alt="logo"
          />
          <Image
            width="35"
            height="35"
            src="/images/DOLLY_LOGO.png"
            alt="logo"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarResponsive"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <a href="/" className="nav-link">
                <i className="fas fa-chart-bar fa-fw" /> Cargar encuesta
              </a>
            </li>
            <li className="nav-item">
              <a href="resultados.html" className="nav-link">
                <i className="fas fa-users fa-fw" /> Resultados por <b>CURSO</b>
              </a>
            </li>
            <li className="nav-item">
              <a href="resultados_old.html" className="nav-link">
                <i className="fas fa-user-graduate fa-fw" /> Resultados por{" "}
                <b>DOCENTE</b>
              </a>
            </li>
            <li className="nav-item">
              <a
                href="https://fede.dm/FIUBA-Plan/"
                target="_blank"
                className="nav-link"
                rel="noreferrer"
              >
                <i className="far fa-calendar-alt fa-fw" /> Organizador de
                Horarios
              </a>
            </li>
            <li className="nav-item">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                href="#"
                className="nav-link"
                data-toggle="modal"
                data-target="#modal-dolly-programa"
              >
                <i className="far fa-question-circle fa-fw" />
              </a>
            </li>
          </ul>
          <div className="custom-control custom-switch">
            <input
              type="checkbox"
              className="custom-control-input"
              id="darkSwitch"
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="custom-control-label" htmlFor="darkSwitch">
              Dark Mode
            </label>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
