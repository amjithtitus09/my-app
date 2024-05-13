import React, { useState, useEffect, useContext } from "react";
import { useQueryParams, Link } from "raviger";
import { Modal } from "./commons/Modal";
import { CreateForm } from "./CreateForm";
import { deleteForm, listForms } from "../utils/apiUtils";
import { Pagination } from "./commons/Pagination";
import { Page } from "./Page";
import { CurrentUserContext } from "../context/CurrentUser";
import { User } from "../types/userTypes";

export type TextFieldTypes = "text" | "email" | "date" | "tel" | "number";

type TextField = {
  kind: "TEXT";
  id: number;
  label: string;
  //   type: TextFieldTypes;
  value: string;
  meta?: {
    timeout: any;
  };
};

export type DropdownField = {
  kind: "DROPDOWN";
  id: number;
  label: string;
  options: string[];
  value: string;
  meta?: {
    timeout: any;
  };
};

export type Answer = {
  form_field: number;
  value: string;
};

export type Submission = {
  form: {
    title: string;
    description: string;
  };
  answers: Answer[];
};

export type FieldKind = "TEXT" | "DROPDOWN";

export type FormField = TextField | DropdownField;

// export interface FormField {
//   id: number;
//   label: string;
//   value: string;
//   type: string;
// }

export interface FormData {
  id: number;
  title: string;
  description: string;
  formFields: FormField[];
  meta?: {
    titleTimeout: any;
  };
}

const fetchForms = async (
  setStateCB: (value: FormData[]) => void,
  setNextUrl: (value: string | null) => void,
  setPreviousUrl: (value: string | null) => void,
  setCountCB: (value: number) => void
) => {
  try {
    const jsonData: Pagination<FormData> = await listForms({
      offset: 0,
      limit: 2,
    });
    setStateCB(jsonData.results);
    setNextUrl(jsonData.next);
    setPreviousUrl(jsonData.previous);
    setCountCB(jsonData.count);
  } catch (error) {
    console.error(error);
  }
};

export function FormList() {
  const [{ search }, setQuery] = useQueryParams();
  const [searchString, setSearchString] = useState("");
  const [newForm, setNewForm] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const [state, setState] = useState<FormData[]>([]);

  useEffect(() => {
    fetchForms(setState, setNextUrl, setPreviousUrl, setCount);
    console.log("USER", currentUser);
  }, []);

  const removeForm = (id: number) => {
    setState([...state.filter((field) => field.id !== id)]);
    deleteFormFunc(id);
  };

  const deleteFormFunc = async (formId: number) => {
    await deleteForm(formId);
    fetchForms(setState, setNextUrl, setPreviousUrl, setCount);
  };

  // useEffect(() => {
  //   let timeout = setTimeout(() => {
  //     saveLocalForms(state);
  //   }, 1000);
  //   return () => clearTimeout(timeout);
  // }, [state]);

  const currentUser: User = useContext(CurrentUserContext);

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
          className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 my-2.5 w-full hover:bg-white focus:bg-white flex-1"
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
              {currentUser?.username?.length > 0 ? (
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
                    onClick={(_) => removeForm(field.id)}
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ))}
      </div>
      {/* <Link
        className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
        type="submit"
        href={`/forms/0`}
      >
        + New Form
      </Link> */}
      <Page
        setStateCB={setState}
        previousUrl={previousUrl}
        nextUrl={nextUrl}
        setNextUrlCB={setNextUrl}
        setPreviousUrlCB={setPreviousUrl}
        setCountCB={setCount}
        count={count}
      />
      <button
        className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
        type="submit"
        // href={`/`}
        onClick={() => setNewForm(true)}
      >
        + New Form
      </button>
      <Link
        className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
        type="submit"
        href={`/`}
      >
        Go Home
      </Link>
      <Modal open={newForm} closeCB={() => setNewForm(false)}>
        <CreateForm></CreateForm>
      </Modal>
    </div>
  );
}
