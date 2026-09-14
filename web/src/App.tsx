import { NavLink, Route, Routes } from "react-router-dom";
import CardListPage from "./pages/CardListPage";
import CardDetailPage from "./pages/CardDetailPage";
import ShopMapPage from "./pages/ShopMapPage";
import ImageParserDemoPage from "./pages/ImageParserDemoPage";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>トレカ買取マップ</h1>
        <nav>
          <NavLink to="/" end>
            価格比較
          </NavLink>
          <NavLink to="/map">店舗マップ</NavLink>
          <NavLink to="/ai-demo">AI解析デモ</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<CardListPage />} />
          <Route path="/card/:cardId" element={<CardDetailPage />} />
          <Route path="/map" element={<ShopMapPage />} />
          <Route path="/ai-demo" element={<ImageParserDemoPage />} />
        </Routes>
      </main>
    </div>
  );
}
