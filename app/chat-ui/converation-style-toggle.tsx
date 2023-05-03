"use client";
import React, { FC, useState } from "react";
import { ConverSationStyle } from "../api/azure-openai/route";

interface ToggleProps {
  onClick: (ConverSationStyle: ConverSationStyle) => void;
}

export const ConversationStyleToggle: FC<ToggleProps> = (props) => {
  const [selected, setSelected] = useState<ConverSationStyle>("FUNNY");

  const onClick = (style: ConverSationStyle) => {
    setSelected(style);
    props.onClick(style);
  };

  return (
    <div className="bg-slate-900 rounded-full p-1">
      <ul className="flex justify-between gap-1 text-sm items-stretch">
        <ToggleItem
          title="Funny"
          isSelected={selected === "FUNNY"}
          onClick={() => onClick("FUNNY")}
        >
          🤣
        </ToggleItem>
        <ToggleItem
          title="Neutral"
          isSelected={selected === "NEUTRAL"}
          onClick={() => onClick("NEUTRAL")}
        >
          😐
        </ToggleItem>
        <ToggleItem
          title="Sad"
          isSelected={selected === "SAD"}
          onClick={() => onClick("SAD")}
        >
          😔
        </ToggleItem>
        <ToggleItem
          title="Angry"
          isSelected={selected === "ANGRY"}
          onClick={() => onClick("ANGRY")}
        >
          🤬
        </ToggleItem>
      </ul>
    </div>
  );
};

interface ToggleItemProps {
  children?: React.ReactNode;
  title: string;
  isSelected: boolean;
  onClick?: () => void;
}

export const ToggleItem: FC<ToggleItemProps> = (props) => {
  return (
    <li
      title={props.title}
      onClick={props.onClick}
      className={`border gap-2 border-transparent py-2 hover:bg-slate-800 cursor-pointer grow justify-center flex rounded-full flex-1 items-center  ${
        props.isSelected
          ? "border-x-slate-700 border-b-slate-700 border-t-slate-600 bg-slate-700 hover:bg-slate-700 hover:text-slate-50 fill-white px-3"
          : ""
      }`}
    >
      <span> {props.children}</span>
      {props.isSelected ? props.title : ""}
    </li>
  );
};
