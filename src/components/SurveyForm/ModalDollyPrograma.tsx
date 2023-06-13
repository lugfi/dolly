import React, { useState } from "react";
import Image from "next/image";

const ModalDollyPrograma = () => {
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
              <div className="modal-body" style={{ textAlign: "center" }}>
                <Image
                  className="img-fluid"
                  src="/images/ovejas_simpsons.gif"
                  width={400}
                  height={400}
                  alt="Dolly Programa"
                />
                <p>
                  Más deliciosa tierna info en el{" "}
                  <a href="https://github.com/lugfi/dolly">repo</a>.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Owww
                </button>
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

export default ModalDollyPrograma;
