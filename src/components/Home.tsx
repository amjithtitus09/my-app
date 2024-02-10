import React from "react";
import logo from "../logo.svg";

export function Home(props: { openFormListCB: () => void }) {
  return (
    <div>
      <div className="flex">
        <img src={logo} className="h-48" alt="" />
        <div className="flex justify-center items-center">
          Welcome to Home Page
        </div>
      </div>

      <button
        className="border-2 border-gray-200 rounded-lg p-2 m-2 bg-blue-400 font-semibold text-white hover:bg-blue-600"
        type="submit"
        onClick={props.openFormListCB}
      >
        View Forms
      </button>
    </div>
  );
}
