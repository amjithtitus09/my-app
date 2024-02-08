import React, { useState } from "react";
import Header from "./Header";
import AppContainer from "./AppContainer";
import { Home } from "./components/Home";
import { Form } from "./components/Form";
import { FormList } from "./components/FormList";

function App() {
  const [state, setState] = useState("HOME");
  const [currentFormState, setCurrentFormState] = useState<number>(0);

  const goToHome = () => {
    setState("HOME");
  };

  const openFormList = () => {
    setState("FORMLIST");
  };
  const openForm = (formId: number) => {
    setState("FORM");
    setCurrentFormState(formId);
  };

  return (
    <AppContainer>
      <div className="p-4 mx-auto bg-white shadow-lg rounded-xl">
        <Header
          title={"Welcome to Lesson 5 #react-typescript with #tailwindcss"}
        />
        {state === "HOME" ? (
          <Home openFormListCB={openFormList} />
        ) : state === "FORM" ? (
          <Form
            goToHomeCB={goToHome}
            openFormListCB={openFormList}
            formId={currentFormState}
          />
        ) : (
          <FormList goToHomeCB={goToHome} openFormCB={openForm} />
        )}
      </div>
    </AppContainer>
  );
}

export default App;
