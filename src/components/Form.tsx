import React, { useState, useEffect, useRef } from "react";
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

  const [state, setState] = useState(() => initialFormData());
  const [newField, setNewField] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  const addField = () => {
    setState({
      ...state,
      formFields: [
        ...state.formFields,
        { id: Number(new Date()), label: newField, type: "text", value: "" },
      ],
    });
    setNewField("");
  };

  const saveFormData = (formData: formData) => {
    let localForms = getLocalForms();
    localForms = localForms.map((form) =>
      form.id === formData.id ? formData : form
    );
    saveLocalForms(localForms);
  };

  const clearForm = () => {
    setState({
      ...state,
      formFields: state.formFields.map((field) => {
        return { ...field, value: "" };
      }),
    });
  };

  const removeField = (id: number) => {
    setState({
      ...state,
      formFields: state.formFields.filter((field) => field.id !== id),
    });
  };

  const setFieldType = (id: number, type: string) => {
    setState({
      ...state,
      formFields: state.formFields.map((field) => {
        if (field.id === id) field = { ...field, type: type };
        return field;
      }),
    });
  };
  const setFieldLabel = (id: number, label: string) => {
    setState({
      ...state,
      formFields: state.formFields.map((field) => {
        if (field.id === id) field = { ...field, label: label };
        return field;
      }),
    });
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
        onChange={(e) => setState({ ...state, title: e.target.value })}
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
                onChange={(e) => setFieldLabel(field.id, e.target.value)}
              ></input>
              <select
                className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white"
                value={field.type}
                onChange={(e) => setFieldType(field.id, e.target.value)}
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
                onClick={(_) => removeField(field.id)}
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
            setNewField(e.target.value);
          }}
        ></input>
        <button
          className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
          type="submit"
          onClick={addField}
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
          onClick={clearForm}
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
