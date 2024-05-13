import React, { useEffect, useRef, useReducer, useState } from "react";
import { navigate, Link } from "raviger";
import {
  FormField,
  FormData,
  TextFieldTypes,
  FieldKind,
  DropdownField,
} from "./FormList";
import {
  createField,
  getForm,
  listFields,
  removeField,
  updateField,
  updateForm,
} from "../utils/apiUtils";
import { list } from "@material-tailwind/react";
import { time } from "console";

const initialformFields: FormField[] = [
  {
    kind: "TEXT",
    id: 1,
    label: "First Name Test",
    value: "",
    meta: { timeout: null },
  },
  {
    kind: "TEXT",
    id: 2,
    label: "Last Name",
    value: "",
    meta: { timeout: null },
  },
  { kind: "TEXT", id: 3, label: "Email", value: "", meta: { timeout: null } },
  {
    kind: "TEXT",
    id: 4,
    label: "Date of Birth",
    value: "",
    meta: { timeout: null },
  },
  {
    kind: "TEXT",
    id: 5,
    label: "Phone Number",
    value: "",
    meta: { timeout: null },
  },
];

export const initialformData: FormData = {
  id: 21,
  title: "First Name Test",
  description: "text",
  formFields: initialformFields,
};
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
  type: "change_field_kind";
  id: number;
  kind: FieldKind;
  updateFieldHandlerCB: any;
};

type ChangeFieldLabelAction = {
  type: "change_field_label";
  id: number;
  label: string;
  updateFieldHandlerCB: any;
};

type AddDropdownOptionAction = {
  type: "add_dropdown_option";
  id: number;
  option: string;
  updateFieldHandlerCB: any;
  setNewOptionCB: any;
};

type RemoveDropdownOptionAction = {
  type: "remove_dropdown_option";
  id: number;
  option: string;
  updateFieldHandlerCB: any;
};

type ChangeFormTitle = {
  type: "change_form_title";
  title: string;
  updateFormHandlerCB: any;
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

type UpdateFormTimeout = {
  type: "update_form_timeout";
  timeout: any;
};

type FormAction =
  | AddAction
  | RemoveAction
  | ClearFormAction
  | ChangeFieldTypeAction
  | ChangeFieldLabelAction
  | ChangeFormTitle
  | LoadForm
  | LoadFields
  | UpdateTimeout
  | UpdateFormTimeout
  | AddDropdownOptionAction
  | RemoveDropdownOptionAction;

const reducer = (state: FormData, action: FormAction) => {
  switch (action.type) {
    case "load_form": {
      return action.payload;
    }
    case "load_fields": {
      return { ...state, formFields: action.payload };
    }
    case "add_field": {
      const newField: FormField = {
        kind: "TEXT",
        id: Number(new Date()),
        label: action.label,
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

    case "change_field_kind":
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (field.id === action.id) {
            field = { ...field, kind: action.kind, options: [] };
            action.updateFieldHandlerCB(
              action.id,
              { kind: action.kind, options: [] },
              field.meta?.timeout
            );
          }
          return field;
        }),
      };
    case "change_field_label":
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (field.id === action.id) {
            field = { ...field, label: action.label };
            action.updateFieldHandlerCB(
              action.id,
              { label: action.label },
              field.meta?.timeout
            );
          }
          return field;
        }),
      };
    case "update_timeout":
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (field.id === action.id)
            field = { ...field, meta: { timeout: action.timeout } };
          return field;
        }),
      };

    case "update_form_timeout":
      return {
        ...state,
        meta: { ...state.meta, titleTimeout: action.timeout },
      };

    case "change_form_title":
      action.updateFormHandlerCB(
        { title: action.title },
        state.meta?.titleTimeout
      );
      return { ...state, title: action.title };
    case "add_dropdown_option":
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (field.id === action.id && "options" in field) {
            let options = field.options !== null ? field.options : [];
            field = { ...field, options: [...options, action.option] };
            action.updateFieldHandlerCB(action.id, { options: field.options });
            action.setNewOptionCB("");
          }
          return field;
        }),
      };
    case "remove_dropdown_option":
      return {
        ...state,
        formFields: state.formFields.map((field) => {
          if (field.id === action.id && "options" in field) {
            let options = field.options !== null ? field.options : [];
            const index = options.indexOf(action.option);
            if (index > -1) options.splice(options.indexOf(action.option), 1);
            field = { ...field, options: options };
            action.updateFieldHandlerCB(action.id, { options: field.options });
          }
          return field;
        }),
      };
  }
};

type ChangeText = {
  type: "change_text";
  value: string;
};

type ChangeKind = {
  type: "change_type";
  value: FieldKind;
};

type ClearText = {
  type: "clear_text";
};

type NewFieldActions = ChangeText | ClearText;
type NewFieldTypeActions = ChangeKind;

const newFieldTitleReducer = (state: string, action: NewFieldActions) => {
  switch (action.type) {
    case "change_text": {
      return action.value;
    }
    case "clear_text":
      return "";
  }
};

const newFieldKindReducer = (state: FieldKind, action: NewFieldTypeActions) => {
  switch (action.type) {
    case "change_type": {
      return action.value;
    }
  }
};

export function Form(props: { formId: number }) {
  const saveLocalForms = (saveFormData: FormData[]) => {
    localStorage.setItem("savedForms", JSON.stringify(saveFormData));
  };

  const [state, dispatch] = useReducer(reducer, initialformData);
  const [newOption, setNewOption] = useState("");

  const [newFieldTitle, newFieldTitleDispatch] = useReducer(
    newFieldTitleReducer,
    ""
  );
  const [newFieldKind, newFieldKindDispatch] = useReducer(
    newFieldKindReducer,
    "TEXT"
  );

  const titleRef = useRef<HTMLInputElement>(null);

  const loadForm = async () => {
    const formData = await getForm(props.formId);
    dispatch({ type: "load_form", payload: formData });
  };

  const loadFields = async () => {
    const fields = await listFields(props.formId);
    dispatch({ type: "load_fields", payload: fields.results });
  };

  useEffect(() => {
    loadForm();
    loadFields();
  }, []);

  const createFieldHandler = async () => {
    let response = await createField(props.formId, {
      label: newFieldTitle,
      kind: newFieldKind,
    });
    loadFields();
    newFieldTitleDispatch({ type: "clear_text" });
    newFieldKindDispatch({ type: "change_type", value: "TEXT" });
  };

  const removeFieldHandler = async (fieldId: number) => {
    try {
      const response = await removeField(props.formId, fieldId);
      await loadFields();
    } catch (error) {
      console.log(error);
    }
  };

  const updateFieldHandler = async (
    fieldId: number,
    field: Partial<FormField>,
    existingTimeout: any
  ) => {
    if (existingTimeout && "label" in field) {
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

  const updateFormHandler = async (
    form: Partial<FormData>,
    titleTimeout: any
  ) => {
    if (titleTimeout) {
      clearTimeout(titleTimeout);
      dispatch({ type: "update_form_timeout", timeout: null });
    }
    const timeout = setTimeout(() => {
      try {
        const response = updateForm(props.formId, form);
      } catch (error) {
        console.log(error);
      }
    }, 2000);
    dispatch({ type: "update_form_timeout", timeout: timeout });
  };

  return (
    <div className="divide-y">
      <input
        className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white"
        type={"text"}
        value={state.title}
        onChange={(e) =>
          dispatch({
            type: "change_form_title",
            title: e.target.value,
            updateFormHandlerCB: updateFormHandler,
          })
        }
        ref={titleRef}
      ></input>
      <div>
        {state.formFields?.map((field: FormField) => (
          <React.Fragment key={field.id}>
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
                    updateFieldHandlerCB: updateFieldHandler,
                  })
                }
              ></input>
              <select
                className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white"
                value={field.kind}
                onChange={(e) =>
                  dispatch({
                    type: "change_field_kind",
                    id: field.id,
                    kind: e.target.value as FieldKind,
                    updateFieldHandlerCB: updateFieldHandler,
                  })
                }
              >
                <option value="TEXT">Text</option>
                <option value="DROPDOWN">Dropdown</option>
              </select>

              <button
                className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
                type="submit"
                onClick={(_) => removeFieldHandler(field.id)}
              >
                Remove
              </button>
            </div>
            {field.kind === "DROPDOWN" ? (
              <div>
                <div className="flex-col">
                  {field.options?.map((option: string) => (
                    <div className="flex mx-14">
                      <input
                        className="flex-1 border-2 border-zinc-300 bg-zinc-300 rounded-2xl p-2.5 m-2.5 hover:bg-white focus:bg-white"
                        type="text"
                        value={option}
                        // onChange={(e) =>
                        //   dispatch({
                        //     type: "change_field_label",
                        //     id: field.id,
                        //     label: e.target.value,
                        //     updateFieldHandlerCB: updateFieldHandler,
                        //   })
                        // }
                      ></input>
                      <button
                        className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-red-400 font-semibold text-white hover:bg-blue-600"
                        type="submit"
                        onClick={(_) =>
                          dispatch({
                            type: "remove_dropdown_option",
                            id: field.id,
                            option: option,
                            updateFieldHandlerCB: updateFieldHandler,
                          })
                        }
                      >
                        Remove Option
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex mx-14">
                  <input
                    className="flex-1 border-2 border-zinc-300 bg-zinc-300 rounded-2xl p-2.5 m-2.5 hover:bg-white focus:bg-white"
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                  ></input>
                  <button
                    className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
                    type="submit"
                    onClick={(_) =>
                      dispatch({
                        type: "add_dropdown_option",
                        id: field.id,
                        option: newOption,
                        updateFieldHandlerCB: updateFieldHandler,
                        setNewOptionCB: setNewOption,
                      })
                    }
                  >
                    Add Option
                  </button>
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex">
        <input
          className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white"
          type="text"
          value={newFieldTitle}
          onChange={(e) => {
            newFieldTitleDispatch({
              type: "change_text",
              value: e.target.value,
            });
          }}
        ></input>
        <select
          className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white"
          value={newFieldKind}
          onChange={(e) =>
            newFieldKindDispatch({
              type: "change_type",
              value: e.target.value as FieldKind,
            })
          }
        >
          <option value="TEXT">Text</option>
          <option value="DROPDOWN">Dropdown</option>
        </select>
        <button
          className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
          type="submit"
          onClick={createFieldHandler}
        >
          Add Field
        </button>
      </div>
      <div className="flex gap-1">
        <button
          className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
          type="submit"
          //   onClick={(_) => saveFormData(state)}
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
