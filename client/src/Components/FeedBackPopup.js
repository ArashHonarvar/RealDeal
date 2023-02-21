import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import { useNavigate } from "react-router-dom";

function FeedbackPopup(props) {

  const navigate = useNavigate();
  const check = !props.showFeedback;

  const toggleFeedback = () => {
    props.setShowFeedback(!props.showFeedback);
    if (props.navigation && !check) {
      navigate(props.navigation);
    }
  }

  return (
    <Modal show={props.showFeedback} onHide={toggleFeedback} centered>
        <Modal.Header closeButton>
          <Modal.Title>RealDeal</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={toggleFeedback}>
            Ok
          </Button>
        </Modal.Footer>
    </Modal>
  );
}

export { FeedbackPopup };