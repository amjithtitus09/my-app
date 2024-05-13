import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { MouseEventHandler, useState } from "react";
import { api } from "../utils/apiUtils";
import { PAGE_LIMIT } from "./commons/Pagination";

const handlePageChange = async (
  url: string | null,
  setStateCB: any,
  setNextUrlCB: (value: string | null) => void,
  setPreviousUrlCB: (value: string | null) => void,
  setCountCB: (value: number) => void,
  addPage: number,
  setPageNumberCB: (value: number) => void,
  pageNumber: number
) => {
  if (url) {
    const jsonData = await api(url);
    setStateCB(jsonData.results);
    setNextUrlCB(jsonData.next);
    setPreviousUrlCB(jsonData.previous);
    setCountCB(jsonData.count);
    setPageNumberCB(pageNumber + addPage);
  }
};

export function Page(props: {
  previousUrl: string | null;
  nextUrl: string | null;
  setStateCB: any;
  setNextUrlCB: any;
  setPreviousUrlCB: any;
  count: number;
  setCountCB: any;
}) {
  const [pageNumber, setPageNumber] = useState(0);

  return (
    <div className="hidden sm:flex sm:flex-1 sm:items-center">
      <div>
        <p className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-medium">{PAGE_LIMIT * pageNumber + 1}</span> to{" "}
          <span className="font-medium">
            {PAGE_LIMIT * (pageNumber + 1) > props.count
              ? props.count
              : PAGE_LIMIT * (pageNumber + 1)}
          </span>{" "}
          of <span className="font-medium">{props.count}</span> results
        </p>
      </div>
      <div className="flex flex-1 justify-end ">
        <button
          onClick={(_) =>
            handlePageChange(
              props.previousUrl,
              props.setStateCB,
              props.setNextUrlCB,
              props.setPreviousUrlCB,
              props.setCountCB,
              -1,
              setPageNumber,
              pageNumber
            )
          }
          hidden={!props.previousUrl}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={(_) =>
            handlePageChange(
              props.nextUrl,
              props.setStateCB,
              props.setNextUrlCB,
              props.setPreviousUrlCB,
              props.setCountCB,
              1,
              setPageNumber,
              pageNumber
            )
          }
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
