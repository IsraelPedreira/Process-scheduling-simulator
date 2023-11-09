import React, { useState, useEffect, Component } from 'react';

export function ProcessFooter(props) {
	let quantumText, switchCostText;
	if (!props.quantum){
		quantumText = "Quantum ainda não definido."
	} else {
		quantumText = `Quantum: ${props.quantum}`
	}
	if (!props.switchCost){
		switchCostText = "Sobrecarga de Chaveamento ainda não definida."
	} else {
		switchCostText = `Sobrecarga de Chaveamento: ${props.switchCost}`
	}

	return (
		<div className="process-footer">
			<div className="process-footer-quantum">
				<strong> {quantumText} </strong>
			</div>
			<div className="process-footer-switchCost">
				<strong> {switchCostText} </strong>
			</div>
		</div>
	)
}

export default ProcessFooter;
