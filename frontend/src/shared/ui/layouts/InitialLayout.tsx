import { Outlet } from "react-router-dom";
import "./InitialLayout.css";

const InitialLayout = () => {
  return (
    <div className="app-wrapper">
      <div className="side-panel">
        <div className="side-deco"></div>
        <div className="side-deco-2"></div>
        <div className="zigzag-text">
          <span className="zigzag-letter">I</span>
          <span className="zigzag-letter">N</span>
          <span className="zigzag-letter">F</span>
          <span className="zigzag-letter">I</span>
          <span className="zigzag-letter">N</span>
          <span className="zigzag-letter">I</span>
          <span className="zigzag-letter">T</span>
          <span className="zigzag-letter">E</span>
          <span className="zigzag-letter">Q</span>
          <span className="zigzag-letter">U</span>
          <span className="zigzag-letter">I</span>
          <span className="zigzag-letter">Z</span>
        </div>
      </div>
      <Outlet></Outlet>
    </div>
  );
};

export default InitialLayout;
