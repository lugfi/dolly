import React from "react";

const FormCourse: React.FC = () => {
  return (
    <form id="form-course">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="col-form-label" htmlFor="cuatri">
        Cuatrimestre
      </label>
      <select id="cuatri" className="custom-select custom-select-lg mb-3">
        <option value="" hidden>
          Elija el cuatrimestre
        </option>
      </select>
    </form>
  );
};

export default FormCourse;
