import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Tools from "./pages/Tools";

function App() {
  return (
    <MainLayout>

      <Routes>

        {/* Homepage */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Tools */}
        <Route
          path="/tools"
          element={<Tools />}
        />

        {/* About */}
        <Route
          path="/about"
          element={<About />}
        />

      </Routes>

    </MainLayout>
  );
}

export default App;