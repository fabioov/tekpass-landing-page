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

const DownloadCodeModal = ({ isOpen, onClose, platform }) => {
  const [code, setCode] = useState("");
  const toast = useToast();

  const handleDownload = () => {
    if (code === "12345") {
      // Determine the file extension based on the platform
      const fileExtension = platform === "Windows" ? ".exe" : ".dmg";

      // API URL
      const apiUrl = `https://api.github.com/repos/${process.env.REACT_APP_OWNER}/${process.env.REACT_APP_REPO}/releases/latest`;

      fetch(apiUrl, {
        headers: {
          'Authorization': `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      })
      .then(response => response.json())
      .then(data => {
        const releaseAssets = data.assets;
        const targetAsset = releaseAssets.find(asset => asset.name.endsWith(fileExtension));

        if (targetAsset) {
          // Create a new <a> element
          const link = document.createElement('a');
          // Set the href to the download URL
          link.href = targetAsset.browser_download_url;
          // Set the download attribute to the desired file name (optional)
          link.setAttribute('download', targetAsset.name);
          // Append the link to the document body (required for Firefox)
          document.body.appendChild(link);
          // Trigger the download
          link.click();
          // Clean up by removing the link from the document
          document.body.removeChild(link);
          // Close the modal or perform any other cleanup
          setCode("");
          onClose();
        } else {
          console.error(`File with extension ${fileExtension} not found in release assets.`);
          toast({
            title: "Download Error",
            description: `No file found for ${platform} with extension ${fileExtension}.`,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          setCode("");
          onClose();
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
      });
      setCode("");
      onClose();
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid download code.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      setCode("");
      onClose();
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
