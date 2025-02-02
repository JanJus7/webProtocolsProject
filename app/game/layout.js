import Navbar from "../components/Navbar";
import "../globals.css";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
