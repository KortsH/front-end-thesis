import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Blockchain from "./pages/Blockchain.tsx";
import Quotes from "./pages/Quotes.tsx";
import DemoPage from "./pages/DemoPage.tsx";
import TrackedPeoplePage from "./pages/TrackedPeople.tsx";

import { TranslationProvider } from "./contexts/TranslationContext.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";

export default function App() {
  return (
    <TranslationProvider>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chain" element={<Blockchain />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="*" element={<TrackedPeoplePage />} />
        </Routes>
      </ThemeProvider>
    </TranslationProvider>
  );
}
