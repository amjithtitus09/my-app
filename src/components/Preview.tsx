import React, { useState, useEffect, useRef, useReducer } from "react";
import { navigate } from "raviger";
import { FormField, FormData, Submission, Answer } from "./FormList";
import {
  getForm,
  listFields,
  submitQuiz,
  updateField,
} from "../utils/apiUtils";
import { initialformData } from "./Form";

type ChangeFieldValue = {
  id: number;
  value: string;
  type: "change_field_value";
  updateFieldHandlerCB: any;
};

type LoadForm = {
  type: "load_form";
  payload: FormData;
};

type LoadFields = {
  type: "load_fields";
  payload: FormField[];
};

type UpdateTimeout = {
  type: "update_timeout";
  id: number;
  timeout: any;
};

type FormAction = ChangeFieldValue | LoadForm | LoadFields | UpdateTimeout;

const reducer = (state: FormData, action: FormAction) => {
  switch (action.type) {
    case "change_field_value":
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (field.id === action.id) {
            field = { ...field, value: action.value };
            action.updateFieldHandlerCB(
              action.id,
              { value: action.value },
              field.meta?.timeout
            );
          }
          return field;
        }),
      };
    case "load_form": {
      return { ...action.payload, formFields: state.formFields };
    }
    case "load_fields": {
      return { ...state, formFields: action.payload };
    }
    case "update_timeout":
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (field.id === action.id)
            field = { ...field, meta: { timeout: action.timeout } };
          return field;
        }),
      };
  }
};

export function Preview(props: { formId: number }) {
  const [state, dispatch] = useReducer(reducer, initialformData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const titleRef = useRef<HTMLInputElement>(null);

  const loadForm = async () => {
    const formData = await getForm(props.formId);
    dispatch({ type: "load_form", payload: formData });
  };

  const loadFields = async () => {
    const fields = await listFields(props.formId);
    if (fields.results.length === 0) navigate(`/forms`);
    dispatch({ type: "load_fields", payload: fields.results });
  };

  useEffect(() => {
    loadForm();
    loadFields();
  }, []);

  const nextQuestion = () => {
    if (currentQuestionIndex < state.formFields.length - 1)
      setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const submitForm = () => {
    if (currentQuestionIndex === state.formFields.length - 1) {
      setCurrentQuestionIndex(0);

      const answers: Answer[] = [];
      state.formFields.map((field) =>
        answers.push({ form_field: field.id, value: field.value })
      );
      const submission: Submission = {
        form: {
          title: state.title,
          description: state.description,
        },
        answers: answers,
      };
      submitQuiz(props.formId, submission);
      navigate(`/forms`);
    }
  };

  useEffect(() => {
    titleRef.current?.focus();
  });

  const updateFieldHandler = async (
    fieldId: number,
    field: Partial<FormField>,
    existingTimeout: any
  ) => {
    if (existingTimeout && "value" in field) {
      clearTimeout(existingTimeout);
      dispatch({ type: "update_timeout", id: fieldId, timeout: null });
    }
    const timeout = setTimeout(() => {
      try {
        const response = updateField(props.formId, fieldId, field);
      } catch (error) {
        console.log(error);
      }
    }, 2000);
    if ("label" in field)
      dispatch({ type: "update_timeout", id: fieldId, timeout: timeout });
  };

  const formField = state.formFields[currentQuestionIndex];

  return (
    <div>
      <h2 className=" text-xl text-center p-3 m-3 w-full  hover:bg-white focus:bg-white">
        {state.title}
      </h2>
      <div className="">
        <div className="flex-col gap-20">
          <React.Fragment key={formField.id}>
            <label>{formField.label}</label>
            <div className="flex">
              {formField.kind === "TEXT" ? (
                <input
                  className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white"
                  type="text"
                  value={formField.value}
                  onChange={(e) =>
                    dispatch({
                      type: "change_field_value",
                      id: formField.id,
                      value: e.target.value,
                      updateFieldHandlerCB: updateFieldHandler,
                    })
                  }
                  ref={titleRef}
                ></input>
              ) : (
                <select
                  className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white"
                  value={formField.value}
                  onChange={(e) =>
                    dispatch({
                      type: "change_field_value",
                      id: formField.id,
                      value: e.target.value,
                      updateFieldHandlerCB: updateFieldHandler,
                    })
                  }
                >
                  {formField.options.map((option: string) => (
                    <option value={option}>{option}</option>
                  ))}
                </select>
              )}
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
