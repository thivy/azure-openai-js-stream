"use client";

import { FC, FormEvent } from "react";

interface Props {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export const PromptInput: FC<Props> = (props) => {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const prompt = formData.get("message") as string;
    if (prompt.length === 0 || props.isLoading) return;
    props.onSubmit(prompt);
  };

  return (
    <form
      className="bg-slate-900 -mx-5 -mb-5 p-5 flex gap-2 items-center"
      onSubmit={onSubmit}
    >
      <input
        type="text"
        autoComplete="off"
        name="message"
        required
        className=" bg-transparent rounded-md p-4 flex-1 max-h-56 text-slate-50 focus:ring-0 focus:outline-none"
        placeholder="Type your message here..."
      ></input>
      <button
        disabled={props.isLoading}
        type="submit"
        className="hover:bg-slate-600  cursor-pointer outline outline-1 outline-offset-4 outline-slate-800 text-white items-center border border-x-slate-700 border-b-slate-700 border-t-slate-600 bg-slate-700 shadow-md justify-center flex rounded-xl p-4"
      >
        {props.isLoading ? "⏳" : "🚀"}
      </button>
    </form>
  );
};
