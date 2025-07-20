import React, { useEffect, useState } from "react";

const ConductorUI: React.FC = () => {
	const [isInitializing, setIsInitializing] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsInitializing(false);
		}, 1500); // 1.5秒でフェードアウト

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="conductor-container">
			{isInitializing && (
				<div className="init-overlay">
					<div className="init-text">INITIALIZING CONDUCTOR v2.1.3...</div>
				</div>
			)}
			<div className="chat-ui">
				<div className="chat-pane">Left Chat Pane</div>
				<div className="output-pane">Right Output Pane</div>
			</div>
		</div>
	);
};

export default ConductorUI;
