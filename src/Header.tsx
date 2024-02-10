import React from "react";
import logo from "./logo.svg";
import { ActiveLink } from "raviger";

export default function Header(props: { title: string }) {
  return (
    <div className="flex gap-2 items-center">
      <img
        src={logo}
        className="animate-spin h-16 w-16"
        alt="logo"
        style={{
          animation: "spin 2s linear infinite",
        }}
      />
      <h1 className="text-center text-xl flex-1 text-gray-500">
        {props.title}
      </h1>
      <div className="flex gap-6 m-2 p-2 ">
        <ActiveLink href="/" exactActiveClass="text-blue-500">
          HOME
        </ActiveLink>
        <ActiveLink href="/about" activeClass="text-blue-500">
          ABOUT
        </ActiveLink>
        <ActiveLink href="/forms" activeClass="text-blue-500">
          FORMS
        </ActiveLink>
      </div>
    </div>
  );
}
