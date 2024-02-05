import React, { useState } from "react";

const formFields = [
  { id: 1, label: "First Name", value: "" },
  { id: 2, label: "Last Name", value: "" },
  { id: 3, label: "Email", type: "email", value: "" },
  { id: 4, label: "Date of Birth", type: "date", value: "" },
  { id: 5, label: "Phone Number", type: "tel", value: "" },
];

export function Form(props: { closeFormCB: () => void }) {
  const [state, setState] = useState(formFields);
  const [newField, setNewField] = useState("");
  const addField = () => {
    setState([
      ...state,
      { id: Number(new Date()), label: newField, type: "text", value: "" },
    ]);
    setNewField("");
  };

  const clearForm = () => {
    setState(
      state.map((field) => {
        return { ...field, value: "" };
      })
    );
  };

  const removeField = (id: number) => {
    setState(state.filter((field) => field.id !== id));
  };

  const setFieldValue = (id: number, value: string) => {
    setState(
      state.map((field) => {
        if (field.id === id) field = { ...field, value: value };
        return field;
      })
    );
  };

  return (
    <div className="divide-y">
      <div>
        {state.map((field) => (
          <React.Fragment key={field.id}>
            <label>{field.label}</label>
            <div className="flex">
              <input
                className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white"
                type={field.type ? field.type : "text"}
                value={field.value}
                onChange={(e) => {
                  setFieldValue(field.id, e.target.value);
                }}
              ></input>
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
        >
          Submit
        </button>
        <button
          className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
          type="submit"
          onClick={props.closeFormCB}
        >
          Close Form
        </button>
        <button
          className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
          type="submit"
          onClick={clearForm}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
