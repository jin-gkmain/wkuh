import React from "react";
import { HiOutlineNewspaper } from "react-icons/hi2";

type props = {
  className?: string;
};

export default function History({ className }: props) {
  return <HiOutlineNewspaper className={className ? className : ""} />;
}
