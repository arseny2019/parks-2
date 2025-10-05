'use client';
import React, { createContext, useContext, useState } from 'react';

// Create the context
export const ModalContext = createContext();

// Provider component
export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
  });

  // Open modal with specific type and props
  const openModal = () => {
    setModalState({
      isOpen: true
    });
  };

  // Close modal
  const closeModal = () => {
    setModalState({
      isOpen: false
    });
  };

  const value = {
    ...modalState,
    openModal,
    closeModal
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};