import AdminPage from "./pages/AdminPage";
import PublicPage from "./pages/PublicPage";

// The entire path segment IS the secret token: /<token>
// "/" → public page; "/<anything>" → admin page (token forwarded as Bearer header)
function getAdminToken(): string | null {
  const match = location.pathname.match(/^\/([^/]+)$/);
  return match ? match[1] : null;
}

export default function App() {
  const token = getAdminToken();
  if (token !== null) {
    return <AdminPage token={token} />;
  }
  return <PublicPage />;
}
