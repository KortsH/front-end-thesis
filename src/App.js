import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Blockchain from "./pages/Blockchain.tsx";

import { TranslationProvider } from "./contexts/TranslationContext.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";

export default function App() {
  return (
    <TranslationProvider>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chain" element={<Blockchain />} />
        </Routes>
      </ThemeProvider>
    </TranslationProvider>
  );
}
