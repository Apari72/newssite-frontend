import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../services/api";

function Articles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiFetch("/api/articles")   // <-- ONLY this
            .then(data => {
                setArticles(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load articles");
                setLoading(false);
            });
    }, []);



    if (loading) return <p>Loading articles...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ padding: "40px", fontFamily: "Arial" }}>
            <h1>News</h1>

            {articles.map((article) => (
                <div key={article.id} style={{ marginBottom: "30px" }}>
                    <h2>
                        <Link to={`/articles/${article.id}`}>{article.title}</Link>
                    </h2>

                    <p>
                        By <strong>{article.author?.name}</strong>
                    </p>

                    <p>
                        ❤️ {article.likeCount} {" | "} 👁 {article.views}
                    </p>

                    <hr />
                </div>
            ))}
        </div>
    );
}

export default Articles;
