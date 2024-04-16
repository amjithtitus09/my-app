import React, { useState, useEffect, useRef, useReducer } from "react";
import { navigate } from "raviger";

interface formField {
  id: number;
  label: string;
  value: string;
  type: string;
}

interface formData {
  id: number;
  title: string;
  formFields: formField[];
}

type ChangeFieldValue = {
  id: number;
  value: string;
  type: "change_field_value";
};

type FormAction = ChangeFieldValue;

const reducer = (state: formData, action: FormAction) => {
  switch (action.type) {
    case "change_field_value":
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (field.id === action.id) field = { ...field, value: action.value };
          return field;
        }),
      };
  }
};

export function Preview(props: { formId: number }) {
  const getLocalForms: () => formData[] = () => {
    const savedFormsJSON = localStorage.getItem("savedForms");
    return savedFormsJSON ? JSON.parse(savedFormsJSON) : [];
  };

  const saveLocalForms = (saveFormData: formData[]) => {
    localStorage.setItem("savedForms", JSON.stringify(saveFormData));
  };

  const initialFormData: () => formData = () => {
    let localForms = getLocalForms();

    let selectedForm = localForms.find((form) => form.id === props.formId);

    return selectedForm ? selectedForm : localForms[123];
  };

  const [state, dispatch] = useReducer(reducer, null, () => initialFormData());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const titleRef = useRef<HTMLInputElement>(null);

  const nextQuestion = () => {
    if (currentQuestionIndex < state.formFields.length - 1)
      setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const submitForm = () => {
    if (currentQuestionIndex === state.formFields.length - 1) {
      setCurrentQuestionIndex(0);
      saveFormData(state);
      navigate(`/forms`);
    }
  };

  const saveFormData = (formData: formData) => {
    let localForms = getLocalForms();
    localForms = localForms.map((form) =>
      form.id === formData.id ? formData : form
    );
    saveLocalForms(localForms);
  };

  useEffect(() => {
    titleRef.current?.focus();
    saveFormData(state);
  });

  return (
    <div>
      <h2 className=" text-xl text-center p-3 m-3 w-full  hover:bg-white focus:bg-white">
        {state.title}
      </h2>
      <div className="">
        <div className="flex-col gap-20">
          <React.Fragment key={state.formFields[currentQuestionIndex].id}>
            <label>{state.formFields[currentQuestionIndex].label}</label>
            <div className="flex">
              <input
                className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white"
                type={state.formFields[currentQuestionIndex].type}
                value={state.formFields[currentQuestionIndex].value}
                onChange={(e) =>
                  dispatch({
                    type: "change_field_value",
                    id: state.formFields[currentQuestionIndex].id,
                    value: e.target.value,
                  })
                }
                ref={titleRef}
              ></input>
            </div>
          </React.Fragment>
        </div>
        <div className="flex py-2.5 justify-center">
          {currentQuestionIndex < state.formFields.length - 1 ? (
            <button
              className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
              type="submit"
              onClick={nextQuestion}
            >
              Next
            </button>
          ) : (
            <button
              className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
              type="submit"
              onClick={submitForm}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
