import React, { useState, useEffect, useRef } from "react";
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
  HStack,
  Flex,
} from "@chakra-ui/react";

const DownloadCodeModal = ({ isOpen, onClose, platform }) => {
  const initialCodeState = Array(6).fill(""); // For 6 input boxes
  const [codeDigits, setCodeDigits] = useState(initialCodeState);
  const toast = useToast();
  const inputRefs = useRef(initialCodeState.map(() => React.createRef()));
  const confirmDownloadButtonRef = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCodeDigits(initialCodeState); // Reset code digits when modal is opened
    }
  }, [isOpen]);

  const handleInputChange = (value, index) => {
    const updatedCodeDigits = [...codeDigits];
    updatedCodeDigits[index] = value.slice(0, 1); // Take only the first character
    setCodeDigits(updatedCodeDigits);

    // Automatically move focus to next input box if value is entered
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].current.focus();
    }
  };
  const enteredCode = codeDigits.join("");

  // const gh_key = process.env.REACT_APP_GITHUB_TOKEN;

  const handleDownload = () => {
    if (enteredCode === "123456") {
      setLoading(true);
  
      // Call the serverless function instead of GitHub API directly
      fetch(`/.netlify/functions/get-latest-release?platform=${encodeURIComponent(platform)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const fileExtension = platform === "Windows" ? ".exe" : ".dmg";
          const releaseAssets = data.assets;
          const targetAsset = releaseAssets.find(asset => asset.name.endsWith(fileExtension));
  
          if (targetAsset) {
            toast({
              title: "Download Started",
              description: "Your download has started. It will complete shortly.",
              status: "info",
              duration: 5000,
              isClosable: true,
              position: "top-right",
            });
  
            // Proceed with creating the link and triggering the download
            const link = document.createElement('a');
            link.href = targetAsset.browser_download_url; // Use browser_download_url from the asset
            link.setAttribute('download', targetAsset.name); // Use the asset's name for the download attribute
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
  
            resetCodeDigitsAndCloseModal();
          } else {
            console.error(`File with extension ${fileExtension} not found in release assets.`);
            toast({
              title: "Download Error",
              description: `No file found for ${platform} with extension ${fileExtension}.`,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top-right",
            });
            resetCodeDigitsAndCloseModal();
          }
        })
        .catch(error => {
          console.error("Error fetching release:", error);
          toast({
            title: "Network Error",
            description: "Failed to fetch release information. Please try again.",
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "top-right",
          });
          resetCodeDigitsAndCloseModal();
        });
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid download code.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      resetCodeDigitsAndCloseModal();
    }
  };
  
  const resetCodeDigitsAndCloseModal = () => {
    setLoading(false);
    setCodeDigits(initialCodeState.map(() => "")); // Resets codeDigits
    onClose(); // Close the modal
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && isOpen) {
      event.preventDefault();
      confirmDownloadButtonRef.current?.click();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent onKeyDown={handleKeyPress}>
      <ModalHeader>Enter Download Code</ModalHeader>
      <ModalBody>
        <Flex justifyContent="center"> {/* Center the HStack horizontally */}
          <HStack>
            {codeDigits.map((digit, index) => (
              <Input
                key={index}
                ref={inputRefs.current[index]}
                placeholder="-"
                value={digit}
                onChange={(e) => handleInputChange(e.target.value, index)}
                maxLength={1}
                type="tel"
                width="45px"
                textAlign="center"
                isDisabled={loading}
              />
            ))}
          </HStack>
        </Flex>
      </ModalBody>
      <ModalFooter>
        <Button isDisabled={loading} isLoading={loading} colorScheme="blue" mr={3} onClick={handleDownload}  ref={confirmDownloadButtonRef}>
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
