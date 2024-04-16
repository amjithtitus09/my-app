import React, { useEffect, useRef, useReducer } from "react";
import { navigate, Link } from "raviger";

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

const initialformFields: formField[] = [
  { id: 1, label: "First Name", type: "text", value: "" },
  { id: 2, label: "Last Name", type: "text", value: "" },
  { id: 3, label: "Email", type: "email", value: "" },
  { id: 4, label: "Date of Birth", type: "date", value: "" },
  { id: 5, label: "Phone Number", type: "tel", value: "" },
];

type RemoveAction = {
  type: "remove_field";
  id: number;
};

type AddAction = {
  type: "add_field";
  label: string;
  callback: () => void;
};

type ClearFormAction = {
  type: "clear_form";
};

type ChangeFieldTypeAction = {
  type: "change_field_type";
  id: number;
  fieldType: string;
};

type ChangeFieldLabelAction = {
  type: "change_field_label";
  id: number;
  label: string;
};

type ChangeFormTitle = {
  type: "change_form_title";
  title: string;
};

type FormAction =
  | AddAction
  | RemoveAction
  | ClearFormAction
  | ChangeFieldTypeAction
  | ChangeFieldLabelAction
  | ChangeFormTitle;

const reducer = (state: formData, action: FormAction) => {
  switch (action.type) {
    case "add_field": {
      const newField = {
        id: Number(new Date()),
        label: action.label,
        type: action.type,
        value: "",
      };
      if (action.label.length > 0) {
        action.callback();
        return {
          ...state,
          formFields: [...state.formFields, newField],
        };
      }
      return state;
    }
    case "remove_field":
      return {
        ...state,
        formFields: state.formFields.filter((field) => field.id !== action.id),
      };
    case "clear_form":
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          return { ...field, value: "" };
        }),
      };

    case "change_field_type":
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (field.id === action.id)
            field = { ...field, type: action.fieldType };
          return field;
        }),
      };
    case "change_field_label":
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (field.id === action.id) field = { ...field, label: action.label };
          return field;
        }),
      };
    case "change_form_title":
      return { ...state, title: action.title };
  }
};

type ChangeText = {
  type: "change_text";
  value: string;
};

type ClearText = {
  type: "clear_text";
};

type NewFieldActions = ChangeText | ClearText;

const newFieldReducer = (state: string, action: NewFieldActions) => {
  switch (action.type) {
    case "change_text": {
      return action.value;
    }
    case "clear_text":
      return "";
  }
};

export function Form(props: { formId: number }) {
  const getLocalForms: () => formData[] = () => {
    const savedFormsJSON = localStorage.getItem("savedForms");
    return savedFormsJSON ? JSON.parse(savedFormsJSON) : [];
  };

  const saveLocalForms = (saveFormData: formData[]) => {
    localStorage.setItem("savedForms", JSON.stringify(saveFormData));
  };

  const initialFormData: () => formData = () => {
    let localForms = getLocalForms();
    let selectedForm;

    if (props.formId === 0) {
      selectedForm = {
        id: Number(new Date()),
        formFields: initialformFields,
        title: "Untitled Form",
      };
      localForms = [...localForms, selectedForm];
      saveLocalForms(localForms);
    } else selectedForm = localForms.find((form) => form.id === props.formId);

    return selectedForm ? selectedForm : localForms[123];
  };

  const [state, dispatch] = useReducer(reducer, null, () => initialFormData());
  const [newField, newFieldDispatch] = useReducer(newFieldReducer, "");
  const titleRef = useRef<HTMLInputElement>(null);

  const saveFormData = (formData: formData) => {
    let localForms = getLocalForms();
    localForms = localForms.map((form) =>
      form.id === formData.id ? formData : form
    );
    saveLocalForms(localForms);
  };

  useEffect(() => {
    document.title = "Form Editor";
    titleRef.current?.focus();
    return () => {
      document.title = "React App";
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      saveFormData(state);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  });

  useEffect(() => {
    state.id !== props.formId && navigate(`/forms/${state.id}`);
  }, [state.id, props.formId]);

  return (
    <div className="divide-y">
      <input
        className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white"
        type={"text"}
        value={state.title}
        onChange={(e) =>
          dispatch({ type: "change_form_title", title: e.target.value })
        }
        ref={titleRef}
      ></input>
      <div>
        {state.formFields.map((field) => (
          <React.Fragment key={field.id}>
            {/* <label>{field.label}</label> */}
            <div className="flex">
              <input
                className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white"
                type="text"
                value={field.label}
                onChange={(e) =>
                  dispatch({
                    type: "change_field_label",
                    id: field.id,
                    label: e.target.value,
                  })
                }
              ></input>
              <select
                className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white"
                value={field.type}
                onChange={(e) =>
                  dispatch({
                    type: "change_field_type",
                    id: field.id,
                    fieldType: e.target.value,
                  })
                }
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                <option value="date">Date</option>
                <option value="tel">Phone</option>
              </select>
              <button
                className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
                type="submit"
                onClick={(_) =>
                  dispatch({
                    type: "remove_field",
                    id: field.id,
                  })
                }
              >
                Remove
              </button>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="flex py-2.5">
        <input
          className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white flex-1"
          type="text"
          value={newField}
          onChange={(e) => {
            newFieldDispatch({
              type: "change_text",
              value: e.target.value,
            });
          }}
        ></input>
        <button
          className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
          type="submit"
          onClick={(_) =>
            dispatch({
              type: "add_field",
              label: newField,
              callback: () => newFieldDispatch({ type: "clear_text" }),
            })
          }
        >
          Add Field
        </button>
      </div>
      <div className="flex gap-1">
        <button
          className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
          type="submit"
          onClick={(_) => saveFormData(state)}
        >
          Save
        </button>
        <button
          className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-gray-400 font-semibold text-white hover:bg-gray-600"
          type="submit"
          onClick={() =>
            dispatch({
              type: "clear_form",
            })
          }
        >
          Clear
        </button>
        <Link
          className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
          type="submit"
          href={`/forms`}
        >
          Go Back
        </Link>
        <Link
          className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
          type="submit"
          href={`/`}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
