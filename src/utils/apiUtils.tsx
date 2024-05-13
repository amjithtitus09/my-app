import { Form } from "../components/CreateForm";
import { FormField, FormData, Submission } from "../components/FormList";
import { PaginationParams } from "../components/commons/Pagination";

const API_BASE_URL = "http://localhost:8000/api/";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export const request = async (
  endpoint: string = "",
  method: RequestMethod = "GET",
  data: any = {},
  completeUrl: string = ""
) => {
  let url = completeUrl.length > 0 ? completeUrl : API_BASE_URL + endpoint;
  let payload;

  if (method === "GET") {
    const requestParams = data
      ? `?${Object.keys(data)
          .map((key) => `${key}=${data[key]}`)
          .join(`&`)}`
      : "";
    url += requestParams;
    payload = null;
  } else {
    payload = data ? JSON.stringify(data) : null;
  }

  //   Basic Authentication
  //   const auth = "Basic " + window.btoa("amjithtitus09@gmail.com:ascii123");

  //  Token Authentication
  const token = localStorage.getItem("token");
  const auth = token ? "Token " + token : "";
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
    body: payload,
  });
  if (response.ok) {
    if (method === "DELETE") return {};
    const json = await response?.json();
    return json;
  } else {
    const errorJson = await response?.json();
    throw Error(errorJson);
  }
};

export const createForm = (form: Form) => {
  return request("forms/", "POST", form);
};

export const login = (username: string, password: string) => {
  return request("auth-token/", "POST", { username, password });
};

export const me = () => {
  return request("users/me/");
};

export const listForms = (pageParams: PaginationParams) => {
  return request("forms/", "GET", pageParams);
};

export const getForm = (formId: number) => {
  return request("forms/" + formId, "GET");
};

export const api = (completeUrl: string) => {
  return request("", "GET", null, completeUrl);
};

export const createField = (formId: number, field: Partial<FormField>) => {
  return request(`forms/${formId}/fields/`, "POST", field);
};

export const listFields = (formId: number) => {
  return request(`forms/${formId}/fields`);
};

export const removeField = (formId: number, fieldId: number) => {
  return request(`forms/${formId}/fields/${fieldId}/`, "DELETE");
};

export const updateField = (
  formId: number,
  fieldId: number,
  field: Partial<FormField>
) => {
  return request(`forms/${formId}/fields/${fieldId}/`, "PATCH", field);
};

export const updateForm = (formId: number, form: Partial<FormData>) => {
  return request(`forms/${formId}/`, "PATCH", form);
};

export const deleteForm = (formId: number) => {
  return request(`forms/${formId}/`, "DELETE");
};

export const submitQuiz = (formId: number, submission: Submission) => {
  return request(`forms/${formId}/submission/`, "POST", submission);
};
