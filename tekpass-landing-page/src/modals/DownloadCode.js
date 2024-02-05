// DownloadCodeModal.js
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";

const DownloadCodeModal = ({ isOpen, onClose }) => {
  const [code, setCode] = useState("");
  const toast = useToast();

  const handleDownload = () => {
    if (code === "12345") {
      toast({
        title: "Code accepted.",
        description: "Starting download...",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      setCode("");
      onClose(); // Close the modal
      window.open(
        "https://drive.google.com/uc?export=download&id=1VeTHFpMZZzu5KHDzhFzLKPAwIZT5r7P_",
        "_blank"
      );
    } else {
      toast({
        title: "Invalid code.",
        description: "Please enter a valid download code.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      setCode("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter Download Code</ModalHeader>
        <ModalBody>
          <Input
            placeholder="Download Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleDownload}>
            Download
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DownloadCodeModal;
