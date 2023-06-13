import { useState } from "react";

interface OkErrorModalProps {
  type: "success" | "error";
  message: string;
}

const OkErrorModal: React.FC<OkErrorModalProps> = ({ type, message }) => {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={openModal}>
        Open Modal
      </button>
      {showModal && (
        <div
          className="modal fade show"
          tabIndex={-1}
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {type === "success"
                    ? "Encuesta enviada"
                    : "Ocurrió un problema"}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>{message}</p>
              </div>
              <div className="modal-footer">
                {type === "success" ? (
                  <>
                    <a
                      href="resultados.html"
                      type="button"
                      className="btn btn-primary"
                    >
                      Ver Resultados
                    </a>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                    >
                      Cargar Otra Encuesta
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cerrar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
      )}
    </>
  );
};

export default OkErrorModal;
