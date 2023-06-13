import React from "react";

interface AlertProps {
  type: string;
  message: string;
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  return (
    <div className={`alert alert-${type} alert-dismissible`} role="alert">
      <h4 className="alert-heading">{message}️</h4>
      <p>
        Abajo podés ir llenando la encuesta. Asegúrate de no sólo puntuar los
        docentes sino también de en lo posible dejar tu reseña.{" "}
      </p>
      <hr />
      <p className="mb-0">
        Cualquier inconveniente o sugerencia, avisanos por el chat o abre un
        issue en el{" "}
        <a href="https://github.com/lugfi/dolly" className="alert-link">
          repositorio de Github
        </a>
      </p>
    </div>
  );
};

export default Alert;
