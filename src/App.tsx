/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { ScenarioDetails } from "./pages/ScenarioDetails";
import Trailers from "./pages/Trailers";
import { TopRated } from "./pages/TopRated";
import { Trending } from "./pages/Trending";
import { Episodes } from "./pages/Episodes";
import { Characters } from "./pages/Characters";
import { Watchlist } from "./pages/Watchlist";
import { Edits } from "./pages/Edits";
import { Scenarios } from "./pages/Scenarios";
import { I18nProvider } from "./contexts/I18nContext";
import { ScenariosProvider } from "./contexts/ScenariosContext";
import { Toaster } from "sonner";

export default function App() {
  return (
    <Router>
      <I18nProvider>
        <ScenariosProvider>
          <Toaster position="top-right" theme="dark" richColors closeButton />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/scenario/:id" element={<ScenarioDetails />} />
              <Route path="/trailers" element={<Trailers />} />
              <Route path="/top-rated" element={<TopRated />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/episodes" element={<Episodes />} />
              <Route path="/characters" element={<Characters />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/edits" element={<Edits />} />
              <Route path="/scenarios" element={<Scenarios />} />
              {/* Fallback route */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Layout>
        </ScenariosProvider>
      </I18nProvider>
    </Router>
  );
}

