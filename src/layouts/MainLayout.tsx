import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#0e0f12] text-white">
      <header className="h-14 flex items-center px-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold">LiveForum</h1>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4">
        <Outlet />
      </main>
    </div>
  );
}
