import React, { useContext } from "react";
import { themeContext } from "../../Context";
import "./Experience.css";
import { Link } from "react-scroll";

const Experience = () => {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;

  return (
    <div className="experience" id='experience'>
      <div className="i-name">
        <span style={{ color: darkMode ? "white" : "" }}>Our Experience</span>
        <span>with Mock Interviews</span>
        <span style={{ fontSize: "20px" }}>
          Practice realistic interviews for over 120 different job positions and improve your skills quickly.
        </span>
      </div>
      
      <div className="achievement">
        <div className="circle" style={{ color: darkMode ? 'var(--orange)' : '' }}>10000+</div>
        <span style={{ color: darkMode ? 'white' : '' }}>Mock </span>
        <span>Interviews Conducted</span>
      </div>
      <div className="achievement">
        <div className="circle" style={{ color: darkMode ? 'var(--orange)' : '' }}>15+</div>
        <span style={{ color: darkMode ? 'white' : '' }}>Feedback </span>
        <span>Sessions</span>
      </div>
      
      <div className="achievement">
        <div className="circle" style={{ color: darkMode ? 'var(--orange)' : '' }}>50+</div>
        <span style={{ color: darkMode ? 'white' : '' }}>Successful </span>
        <span>Placements</span>
      </div>
        <div>
        </div>
    </div>
    
    
  );
};

export default Experience;
