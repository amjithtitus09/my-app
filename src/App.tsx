import React from "react";
import Header from "./Header";
import AppContainer from "./AppContainer";

const formFields = [
  { id: 1, label: "First Name" },
  { id: 2, label: "Last Name" },
  { id: 3, label: "Email", type: "email" },
  { id: 4, label: "Date of Birth", type: "date" },
  { id: 5, label: "Phone Number", type: "tel" },
];
function App() {
  return (
    <AppContainer>
      <div className="p-4 mx-auto bg-white shadow-lg rounded-xl">
        <Header
          title={"Welcome to Lesson 5 #react-typescript with #tailwindcss"}
        />
        {formFields.map((field) => (
          <React.Fragment key={field.id}>
            <label>{field.label}</label>
            <input
              className="border-2 border-zinc-200 bg-zinc-100 rounded-2xl p-2.5 m-2.5 w-full hover:bg-white focus:bg-white"
              type={field.type ? field.type : "text"}
            ></input>
          </React.Fragment>
        ))}
        <button
          className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
          type="submit"
        >
          Submit
        </button>
      </div>
    </AppContainer>
  );
}

export default App;
