import React from 'react';
import './App.css';
import StudyQuestMainContainer from "./StudyQuestMainContainer";

/**
 * PUBLIC_INTERFACE
 * App: Root application component, sets up StudyQuest AI main navigation and content.
 */
function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol" style={{ color: "#F59E42" }}>🧠</span> StudyQuest AI
            </div>
          </div>
        </div>
      </nav>

      <main>
        <StudyQuestMainContainer />
      </main>
    </div>
  );
}

export default App;