import React from "react";
import Header from "./Header";
import { User } from "./types/userTypes";

export default function AppContainer(props: {
  currentUser: User;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-400 items-center">
      <div className="p-4 mx-auto bg-white shadow-lg rounded-xl">
        <Header title={"Welcome"} currentUser={props.currentUser} />
        {props.children}
      </div>
    </div>
  );
}
 