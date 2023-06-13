import React from "react";
import Alert from "./Alert";
import FormCourse from "./FormCourse";
import Encuesta from "./Encuesta";
import SendButton from "./SendButton";
import ModalDollyPrograma from "./ModalDollyPrograma";
import OkErrorModal from "./OkErrorModal";
import ChangeDocenteModal from "./ChangeDocenteModal";

const SurveyForm: React.FC = () => {
  return (
    <div>
      <div className="container mt-3">
        <Alert type="success" message="Cargar encuesta 🖌️" />
        <Encuesta />
        <FormCourse />
        <SendButton />
        <OkErrorModal
          type="success"
          message="Se registraron los datos correctamente, ¡muchas gracias!"
        />
        <OkErrorModal
          type="error"
          message="No se pudieron registrar los datos, intentá nuevamente más tarde."
        />
      </div>
      <ModalDollyPrograma />
      <ChangeDocenteModal />
    </div>
  );
};

export default SurveyForm;
