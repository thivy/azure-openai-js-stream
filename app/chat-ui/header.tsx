export const Header = () => {
  return (
    <div className="header flex justify-between border-b border-slate-600 pb-3 items-center">
      <span>Azure Open AI</span>
      <div className="cursor-pointer outline outline-1 outline-offset-4 outline-slate-800 text-white gap-2 items-center border border-x-slate-700 border-b-slate-700 border-t-slate-600 bg-slate-900 shadow-md justify-center flex rounded-full p-2">
        <img src="/azure.svg" alt="azure logo" />
      </div>
    </div>
  );
};
