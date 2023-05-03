import { Inter } from "next/font/google";
import { ChatUI } from "./chat-ui/chat-ui";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div
      className={`min-h-screen bg-slate-950 flex items-center place-content-center overflow-hidden ${inter.className}`}
    >
      <ChatUI />
    </div>
  );
}
