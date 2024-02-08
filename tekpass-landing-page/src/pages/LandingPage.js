import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  VStack,
  Flex,
  Text,
  Heading,
  Link,
  Container,
  useColorMode,
  IconButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  DrawerCloseButton,
  useColorModeValue,
  Spacer,
  Divider,
  useToast,
  Image,
} from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FaWindows } from "react-icons/fa"; // Using FontAwesome's Windows icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import { css, keyframes } from "@emotion/react";
import DownloadCodeModal from "../modals/DownloadCode";
import { ReactComponent as EncryptedIcon } from "../images/encrypted.svg";
import { ReactComponent as TranslationIcon } from "../images/translation.svg";
import { ReactComponent as SecurityIcon } from "../images/security.svg";

// Define animations using keyframes
const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
`;

// Navbar component with a theme switcher
const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const navbarBg = useColorModeValue(
    "navbar.light.backgroundColor",
    "navbar.dark.backgroundColor"
  );
  const navbarColor = useColorModeValue(
    "navbar.light.color",
    "navbar.dark.color"
  );
  const linkHoverBg = useColorModeValue(
    "hoverLink.light.backgroundColor",
    "hoverLink.dark.backgroundColor"
  );
  const linkHoverColor = useColorModeValue(
    "hoverLink.light.color",
    "hoverLink.dark.color"
  );
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingUp = currentScrollY > lastScrollY;
      const nearTop = currentScrollY < 80;

      // Show button when scrolling up and more than 80px away from the top
      if (scrollingUp && !nearTop) {
        setShowButton(true);
      }
      // Hide button when scrolling down and within 80px of the top
      else if (!scrollingUp && nearTop) {
        setShowButton(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const buttonStyle = css`
    animation: ${showButton ? slideIn : slideOut} 0.5s forwards;
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10;
  `;
  return (
    <>
      {/* Navbar with Theme Toggle */}
      <Flex
        justify="space-between"
        align="center"
        padding="4"
        position="fixed"
        top="0"
        left="50%" // Position the navbar starting from the center of the page
        transform="translateX(-50%)" // Shift the navbar back to ensure it's centered
        width="80%" // Set the navbar width to 80% of the viewport width
        maxWidth="100%" // Ensure the navbar does not exceed the viewport width
        transition="0.5s ease-out"
        zIndex="banner"
      >
        {!showButton && (
          <>
            <Flex gap="4">
              <Link
                href="#home"
                _hover={{ bg: linkHoverBg, color: linkHoverColor }}
              >
                Home
              </Link>
              <Link
                href="#features"
                _hover={{ bg: linkHoverBg, color: linkHoverColor }}
              >
                Features
              </Link>
              <Link
                href="#contact"
                _hover={{ bg: linkHoverBg, color: linkHoverColor }}
              >
                Contact Us
              </Link>
            </Flex>
            <IconButton
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
            />
          </>
        )}
      </Flex>

      <Box css={buttonStyle}>
        <IconButton
          icon={<HamburgerIcon />}
          onClick={onOpen}
          aria-label="Open menu"
        />
      </Box>

      {/* Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        blockScrollOnMount={false}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>TekPass</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" height="full">
              {/* Links centered */}
              <Link href="#home" onClick={onClose} textAlign="center">
                Home
              </Link>
              <Link href="#features" onClick={onClose} textAlign="center">
                Features
              </Link>
              <Link href="#contact" onClick={onClose} textAlign="center">
                Contact Us
              </Link>

              {/* Pushes everything above it to the top, and below it to the bottom */}
              <Spacer />

              {/* Horizontal bar */}
              <Divider />

              {/* Toggle button centered at the bottom */}
              <Flex justify="center" pt={4}>
                <IconButton
                  icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                  aria-label="Toggle theme"
                  onClick={() => {
                    toggleColorMode();
                    onClose();
                  }}
                  variant="ghost"
                />
              </Flex>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const Section = ({ id, children, isNarrow }) => (
  <Flex
    as="section"
    id={id}
    py="20"
    px="4"
    minH="100vh" // Ensure section takes up at least the full height of the viewport
    width="auto" // Adapt width to the content or container specifications
    justify="center" // Horizontally center content
    align="center" // Vertically center content
    direction="column" // Stack children vertically
    mx="auto" // Center section in the available horizontal space
  >
    <Box width={isNarrow ? "60%" : "auto"} mx="auto">
      {children}
    </Box>
  </Flex>
);



const LandingPage = () => {
  const notify = useToast();
  const [isDesktop, setIsDesktop] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');


  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /iphone|ipad|ipod|android/i.test(userAgent);
    setIsDesktop(!isMobileDevice);
  }, []);

  const {
    isOpen: isDownloadCodeModalOpen,
    onOpen: onDownloadCodeModalOpen,
    onClose: onDownloadCodeModalClose,
  } = useDisclosure();

  const navbarBg = useColorModeValue(
    "navbar.light.backgroundColor",
    "navbar.dark.backgroundColor"
  );

  const handleOpenModal = () => {
    if (!isDesktop) {
      // Notify mobile users that downloading is restricted
      notify({
        title: "Download Unavailable",
        description: "The download feature is available on desktop devices only.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } else {
      // Open the modal for desktop users
      onDownloadCodeModalOpen();
    }
  };

  return (
    <>
      <Box width="80%" margin="0 auto">
        <Container maxW="container.xl">
          <Navbar />
          <Section id="home">
            <VStack spacing="4" textAlign="center">
              <Heading>Welcome to TekPass</Heading>
              <Text>Download the app for your platform</Text>
              <Flex
                direction={{ base: "column", md: "row" }} // Stacks vertically on small screens, horizontally on medium and larger screens
                gap="4"
                alignItems="center" // Centers the buttons when stacked vertically
              >
                <Button
                  leftIcon={<FontAwesomeIcon icon={faApple} />}
                  colorScheme="teal"
                  size="lg"
                  as="a"
                  onClick={() => {
                    setSelectedPlatform('macOS');
                    handleOpenModal();
                  }}
                >
                  Download for macOS
                </Button>

                <Button
                  leftIcon={<FaWindows />}
                  colorScheme="teal"
                  size="lg"
                  onClick={() => {
                    setSelectedPlatform('Windows');
                    handleOpenModal();
                  }}
                >
                  Download for Windows
                </Button>
              </Flex>
            </VStack>
          </Section>
          <Section id="features">
            <Flex
              direction="column"
              align="center"
              justify="center"
              maxW="600px"
              margin="0 auto"
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
                maxW="600px"
                margin="0 auto"
              >
                <VStack spacing="8">
                  <Heading size="lg">App Functionalities and Features</Heading>

                  {/* Encrypted Data Storage Icon */}
                  <Box textAlign="center" width="100%">
                    <Box
                      display="flex"
                      justifyContent="center"
                      marginBottom="10px"
                    >
                      <EncryptedIcon
                        style={{ height: "100px", width: "100px" }}
                        fill="teal"
                      />
                    </Box>
                    <Heading size="md">Encrypted Data Storage</Heading>
                    <Text>
                      TekPass ensures your SAP connection credentials are stored
                      securely with end-to-end encryption, protecting your
                      sensitive information from unauthorized access.
                    </Text>
                  </Box>

                  {/* Multilingual Support Icon */}
                  <Box textAlign="center" width="100%">
                    <Box
                      display="flex"
                      justifyContent="center"
                      marginBottom="10px"
                    >
                      <TranslationIcon
                        style={{ height: "100px", width: "100px" }}
                        fill="teal"
                      />
                    </Box>
                    <Heading size="md">Multilingual Support</Heading>
                    <Text>
                      Catering to a global audience, TekPass offers an intuitive
                      user interface in Portuguese, English, Spanish, Chinese,
                      Hindi, and German, making it accessible to users
                      worldwide.
                    </Text>
                  </Box>

                  {/* Secure Signup and Sign In Icon */}
                  <Box textAlign="center" width="100%">
                    <Box
                      display="flex"
                      justifyContent="center"
                      marginBottom="10px"
                    >
                      <SecurityIcon
                        style={{ height: "100px", width: "100px" }}
                        fill="teal"
                      />
                    </Box>
                    <Heading size="md">Secure Signup and Sign In</Heading>
                    <Text>
                      With advanced security measures, TekPass provides a safe
                      and reliable way for users to sign up and sign in,
                      ensuring your credentials are always protected.
                    </Text>
                  </Box>

                  {/* Additional features can be added here */}
                </VStack>
              </Box>
            </Flex>
          </Section>

          <Section id="contact" isNarrow>
            <VStack spacing="4">
              <Heading>Contact Us</Heading>
              <Text>Have questions? Reach out to us.</Text>
              <FormControl>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input id="name" placeholder="Your Name" />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input id="email" type="email" placeholder="Your Email" />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel htmlFor="message">Message</FormLabel>
                <Textarea id="message" placeholder="Your Message" />
              </FormControl>
              <Button
                mt={4}
                colorScheme="teal"
                onClick={() => {
                  /* Handle form submission */
                }}
              >
                Send Message
              </Button>
            </VStack>
          </Section>
          <Box as="footer" textAlign="center" py="5">
            © {new Date().getFullYear()} TekPass. All rights reserved.
          </Box>
        </Container>
      </Box>
      <DownloadCodeModal
        isOpen={isDownloadCodeModalOpen}
        onClose={onDownloadCodeModalClose}
        platform={selectedPlatform}
      />
    </>
  );
};

export default LandingPage;
