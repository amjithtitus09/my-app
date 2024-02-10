import React, { useState, useEffect } from "react";
import { useQueryParams, Link } from "raviger";

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

export function FormList() {
  const [{ search }, setQuery] = useQueryParams();
  const [searchString, setSearchString] = useState("");

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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQuery({ search: searchString });
        }}
      >
        <label>Search</label>
        <input
          className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white flex-1"
          type="text"
          name="search"
          value={searchString}
          autoComplete="off"
          onChange={(e) => {
            setSearchString(e.target.value);
          }}
        ></input>
      </form>

      <div className="divide-y">
        {state
          .filter((form) =>
            form.title.toLowerCase().includes(search?.toLowerCase() || "")
          )
          .map((field) => (
            <div key={field.id} className="flex gap-1">
              <div className="flex w-full items-center px-10 m-4 font-semibold border-4 rounded-lg bg-gray-200">
                {field.title}
              </div>
              <div className="flex gap-1 p-2 m-2">
                <Link
                  className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
                  type="submit"
                  href={`/forms/${field.id}`}
                >
                  Edit
                </Link>
                <Link
                  className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
                  type="submit"
                  href={`/preview/${field.id}`}
                >
                  Quiz
                </Link>
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
      <Link
        className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
        type="submit"
        href={`/forms/0`}
      >
        + New Form
      </Link>
      <Link
        className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
        type="submit"
        href={`/`}
      >
        Go Home
      </Link>
    </div>
  );
}
