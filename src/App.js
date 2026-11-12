const BUILD_TAG = "dc-2964";
import { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';
import './App.css';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return;
        }
        setError(true);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  const toggleBookmark = useCallback((id) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  return (
    <div data-build={BUILD_TAG}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="play" element={<Play />} />
          <Route path="result" element={<Result />} />
          <Route path="history" element={<History />} />
          <Route
            path="questions"
            element={
              <QuestionBank
                questions={questions}
                loading={loading}
                error={error}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
              />
            }
          />
          <Route
            path="questions/:id"
            element={
              <QuestionDetail
                questions={questions}
                loading={loading}
                error={error}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
