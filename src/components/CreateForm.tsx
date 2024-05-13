import { Fragment, useEffect, useReducer, useRef, useState } from "react";
import { Modal } from "./commons/Modal";
import { navigate } from "raviger";
import { createForm } from "../utils/apiUtils";

export type Form = {
  id?: number;
  title: string;
  description?: string;
  is_public?: boolean;
};

export type Errors<T> = Partial<Record<keyof Form, string>>;

export const validateForm = (form: Form) => {
  const errors: Errors<Form> = {};
  if (form.title.length < 1) {
    errors.title = "Title is required";
  } else if (form.title.length > 100) {
    errors.title = "Title must be less than 100 characters";
  }
  return errors;
};

export function CreateForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    is_public: true,
  });
  const [errors, setErrors] = useState<Errors<Form>>({});

  const createFormAPI = async (form: Form) => {
    try {
      const data = await createForm(form);
      navigate(`/forms/${data.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          //   setQuery({ search: searchString });
        }}
      >
        <div>
          <label>Title</label>
          <input
            className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white"
            type="text"
            // id=
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          ></input>
          <label>Description</label>
          <input
            className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white"
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          ></input>
          {/* <label>Is Public</label> */}
          {/* <input
            className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5  hover:bg-white focus:bg-white"
            type="checkbox"
            value={form.is_public}
            onChange={(e) => setForm({ ...form, is_public: e.target.value })}
          ></input> */}
        </div>
        <button
          className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
          type="submit"
          onClick={(_) => createFormAPI(form)}
        >
          Create
        </button>
      </form>
    </div>
  );
}
