import React from "react";

const SendButton: React.FC = () => {
  return (
    <div
      id="cardSend"
      className="card text-white bg-info mb-3 collapse mt-4"
      style={{ maxWidth: "35rem" }}
    >
      <h5 className="card-header">Ya casi estamos</h5>
      <div className="card-body">
        <p className="card-text">
          Podés revisar si tudo está bien. Si es así, presioná el botón de
          abajo. Recordá que tus comentarios deben estar en un lenguaje
          respetuoso. Cualquier encuesta que no tenga estas características no
          será tomada en cuenta y se borrará. Por favor, colaboremos con este
          espacio que nos ayuda a todos de manera coherente.
        </p>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" id="sendButton" className="btn btn-light mt-3">
          Enviar encuesta 📤
        </a>
      </div>
    </div>
  );
};

export default SendButton;
