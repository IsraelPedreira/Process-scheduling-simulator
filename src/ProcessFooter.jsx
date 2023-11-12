import React, { useState, useEffect, Component } from 'react';

export function ProcessFooter(props) {
	let quantumText, switchCostText;
	if (!props.quantum){
		quantumText = "Quantum indefinido."
	} else {
		quantumText = `Quantum: ${props.quantum}`
	}
	if (!props.switchCost){
		switchCostText = "Sobrecarga indefinida."
	} else {
		switchCostText = `Sobrecarga: ${props.switchCost}`
	}

	return (
		<div className="process-footer">
			<div style={{display: "flex", width: "40%"}}>
				<div className="process-footer-text">
					<strong> {quantumText} </strong>
				</div>
				<div className="process-footer-text">
					<strong> {switchCostText} </strong>
				</div>
			</div>
			<div style={{display: "flex", width: "60%"}}>
				<div className="process-footer-text">
					<strong> Escalonamento: {props.schedMode} </strong>
				</div>
				<div className="process-footer-text">
					<strong> Paginação: {props.memMode} </strong>
				</div>
			</div>
		</div>
	)
}

export default ProcessFooter;
