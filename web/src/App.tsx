import { NavLink, Route, Routes } from "react-router-dom";
import CardListPage from "./pages/CardListPage";
import CardDetailPage from "./pages/CardDetailPage";
import ShopListPage from "./pages/ShopListPage";
import ShopDetailPage from "./pages/ShopDetailPage";
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
          <NavLink to="/shops">店舗一覧</NavLink>
          <NavLink to="/ai-demo">AI解析デモ</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<CardListPage />} />
          <Route path="/card/:cardId" element={<CardDetailPage />} />
          <Route path="/shops" element={<ShopListPage />} />
          <Route path="/shop/:shopId" element={<ShopDetailPage />} />
          <Route path="/map" element={<ShopMapPage />} />
          <Route path="/ai-demo" element={<ImageParserDemoPage />} />
        </Routes>
      </main>
    </div>
  );
}
