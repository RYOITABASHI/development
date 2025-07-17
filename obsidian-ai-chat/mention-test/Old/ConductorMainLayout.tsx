import React from "react";

const ConductorMainLayout: React.FC = () => {
  return (
    <div className="conductor-layout">
      <div className="conductor-left">
        <div className="conductor-header">∠CONDUCTOR</div>
        <div className="conductor-body">
          <div className="conductor-message">
            assistant: Hello! Main Layout.
          </div>
          <input
            className="conductor-input"
            type="text"
            placeholder="Type message..."
          />
        </div>
      </div>
      <div className="conductor-right">
        <div className="conductor-output-header">Generated Output</div>
        <div className="conductor-output-body">
          Generated content will appear here--
        </div>
      </div>
    </div>
  );
};

export default ConductorMainLayout;
