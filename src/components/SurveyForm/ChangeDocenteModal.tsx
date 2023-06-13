import React from "react";

const ChangeDocenteModal: React.FC = () => {
  return (
    <div className="modal" tabIndex={-1} role="dialog" id="changeDocenteModal">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Cambiar Docente 🔄</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>
              A veces hay errores u omisiones en los listados que publica la
              Facultad. Si en lugar de{" "}
              <strong className="docentePlace">X</strong> cursaste con otra
              persona, podés buscar a dicho docente en la lista de abajo:
            </p>
            <fieldset>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="newDocente" className="col-sm-2 col-form-label">
                Reemplazo:
              </label>
              <select
                id="newDocente"
                className="col-sm-7 selectpicker show-tick"
                data-container="body"
                data-live-search="true"
                data-style="btn-primary"
                title="Buscá tu docente acá"
              />
              <button
                type="button"
                className="btn btn-primary col-sm-2"
                id="changeDocente"
                disabled
              >
                Cambiar
              </button>
            </fieldset>
          </div>
          <div className="card-footer text-muted">
            Si este docente está de más o ya lo llenaste previo a un cambio ,
            podes eliminarlo de la encuesta (avisanos por chat quien falta o si
            esta de más porfa):
            <fieldset>
              <button
                type="button"
                className="btn btn-danger"
                id="deleteDocente"
              >
                Eliminar docente
              </button>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeDocenteModal;
