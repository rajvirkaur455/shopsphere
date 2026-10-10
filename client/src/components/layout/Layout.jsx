import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className="flex-1">
        <Outlet context={{ searchQuery, setSearchQuery }} />
      </main>
      <Footer />
    </div>
  );
}
