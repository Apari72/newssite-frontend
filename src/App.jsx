import { Routes, Route } from "react-router-dom";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import JournalistProfile from "./pages/JournalistProfile";
import CreateArticle from "./pages/CreateArticle.jsx";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Articles />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/journalists/:id" element={<JournalistProfile />} />
            <Route path="/write" element={<CreateArticle />} />
            <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
    );
}

export default App;
