import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="
      min-h-screen
      bg-gray-50
      dark:bg-gray-950
      text-gray-900
      dark:text-white
      transition-colors
      duration-300
    ">

      <Navbar />

      <main className="min-h-screen">
        {children}
      </main>

      <Footer />

    </div>
  );
};

export default MainLayout;