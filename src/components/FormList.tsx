import React, { useState, useEffect } from "react";

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

export function FormList(props: {
  goToHomeCB: () => void;
  openFormCB: (formId: number) => void;
}) {
  const getLocalForms: () => formData[] = () => {
    const savedFormsJSON = localStorage.getItem("savedForms");
    return savedFormsJSON ? JSON.parse(savedFormsJSON) : [];
  };

  const initialFormData: () => formData[] = () => {
    return getLocalForms();
  };

  const saveLocalForms = (saveFormData: formData[]) => {
    localStorage.setItem("savedForms", JSON.stringify(saveFormData));
  };

  const removeField = (id: number) => {
    setState([...state.filter((field) => field.id !== id)]);
  };

  const [state, setState] = useState(() => initialFormData());

  useEffect(() => {
    let timeout = setTimeout(() => {
      saveLocalForms(state);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [state]);

  return (
    <div>
      <div className="divide-y">
        {state.map((field) => (
          <div key={field.id} className="flex gap-2">
            <div className="flex items-center px-24 m-2 font-semibold border-2 rounded-lg bg-gray-200">
              {field.title}
            </div>
            <div className="flex gap-1 p-2 m-2">
              <button
                className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
                type="submit"
                onClick={() => props.openFormCB(field.id)}
              >
                View
              </button>
              <button
                className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-red-500 font-semibold text-white hover:bg-red-700"
                type="submit"
                onClick={(_) => removeField(field.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
        type="submit"
        onClick={() => props.openFormCB(0)}
      >
        New Form
      </button>
      <button
        className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
        type="submit"
        onClick={props.goToHomeCB}
      >
        Go Home
      </button>
    </div>
  );
}
