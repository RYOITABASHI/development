import React from "react";

export default function DeviceResponsiveUI() {
  return (
    <div className="conductor-layout pc">
      <div className="conductor-left">
        <div className="conductor-header">∠CONDUCTOR</div>
        <div className="conductor-body">
          <div className="conductor-message">
            assistant: Hello! PC optimized Conductor.
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
}
