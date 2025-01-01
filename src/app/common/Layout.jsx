import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

  // Layout.jsx
  const Layout = ({ children }) => {
    return (
      <div className="flex min-h-screen flex-col w-full">
        <Header />
        <div className="flex flex-1 mt-16">
          <div className="hidden lg:block">
          <Sidebar />

          </div>
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    );
  };
  
export default Layout;