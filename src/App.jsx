import { Routes, Route } from "react-router-dom";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import JournalistProfile from "./pages/JournalistProfile";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Articles />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/journalists/:id" element={<JournalistProfile />} />
        </Routes>
    );
}

export default App;
