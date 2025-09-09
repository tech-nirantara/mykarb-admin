import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CompanyOnboarding from "./pages/CompanyOnboarding";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/onboarding" element={<CompanyOnboarding />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

