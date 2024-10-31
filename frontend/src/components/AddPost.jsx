import React, { useState, useRef, useEffect } from 'react';
import {
    Box, Button, Input, Textarea, VStack, Flex, FormControl, FormLabel, InputGroup, CloseButton, Avatar, useToast, Icon, Text, List, ListItem, HStack, Card,
    CardBody,
    CardFooter, ModalFooter,
    CardHeader, Menu, MenuButton, MenuItem, MenuList,
    TabPanel,
    TabPanels,
    Tab,
    TabList,
    Tabs
} from '@chakra-ui/react';
import { AiOutlinePaperClip } from "react-icons/ai";
import { ChevronDownIcon } from "@chakra-ui/icons";
import useProfileLoading from './useProfileLoading';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import ApiCalls from './ApiCalls';
import Markdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import remarkGfm from 'remark-gfm';


function AddPost() {
    const [postText, setPostText] = useState('');
    const [files, setFiles] = useState([]);  
    const fileInputRef = useRef(null);
    const textAreaRef = useRef(null);  
    const toast = useToast();
    const [privacy, setPrivacy] = useState('PUBLIC'); 
    const { user, token } = useAuth();
    const { profileData } = useProfileLoading({ profile: user });
    const navigate = useNavigate();


    const handlePostTextChange = (event) => {
        setPostText(event.target.value);
    };

    const handleFileChange = (event) => {
        setFiles([...event.target.files]);  // Convert FileList to array
    };

    const handleRemoveFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('text', postText);
        formData.append('privacy', privacy);
        files.forEach(file => formData.append('files', file));

        const response = await ApiCalls.post(`/profiles/${user}/posts`, formData, {
            headers: {
                // 'Content-Type': 'multipart/form-data'
            }
        });
        //const data = response.data; 
        toast({
            title: 'Post created.',
            description: `Post created Successfully!`,
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top'
        });

    };



    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const selectPrivacy = (newPrivacy) => {
        setPrivacy(newPrivacy);
    };

    // Function to automatically adjust textarea height
    const autoResizeTextArea = () => {
        const textArea = textAreaRef.current;
        if (textArea) {
            // Reset height temporarily to shrink if text is deleted
            textArea.style.height = 'auto';
            // Set height based on scroll height to expand to fit all content
            textArea.style.height = `${textArea.scrollHeight}px`;
        }
    };

    // Adjust textarea height whenever text changes
    useEffect(() => {
        autoResizeTextArea();
    }, [postText]);  // Dependency on postText to run effect whenever it changes

    return (
        // <Box display="flex" flexDirection="column" alignItems="center" m§={5} background={"lightblue"}>
        <Card
        // w="70%"

        // position="relative"
        // p={8}
        // shadow='md'
        // borderRadius='md'
        >
            {/* <CloseButton position="absolute" right="8px" top="-2px" onClick={() => alert('Card close button clicked!')} /> */}

            <CardHeader>
                <Flex alignItems="center" gap="4">
                    <Avatar name={profileData ? profileData.name : 'No Name'}
                        src={profileData ? profileData.profilePic?.fileUrl : 'path/to/default/avatar.png'}
                        size='lg' />
                    <Box>
                        <Text fontWeight="bold" fontSize="lg">{profileData ? profileData.name : 'No Name'}</Text>
                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                {privacy}
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={() => selectPrivacy('PUBLIC')}>PUBLIC</MenuItem>
                                <MenuItem onClick={() => selectPrivacy('PRIVATE')}>PRIVATE</MenuItem>
                                <MenuItem onClick={() => selectPrivacy('FRIENDS')}>With Followers</MenuItem>
                            </MenuList>
                        </Menu>
                    </Box>
                </Flex>
            </CardHeader>

            <CardBody >
                <Flex alignItems="start" gap="4">
                    <VStack spacing={4} flex="1" style={
                                {
                                    'max-height': 'calc(100vh - 100px)',
                                    'overflow-y': 'auto',
                                }
                            }>
                        <FormControl isRequired >


                            <Tabs >
                                <TabList>
                                    <Tab>Text Area</Tab>
                                    <Tab>View Markdown</Tab>
                                </TabList>

                                <TabPanels>
                                    <TabPanel>
                                        <Textarea
                                            ref={textAreaRef}
                                            id='post-text'
                                            value={postText}
                                            onChange={handlePostTextChange}
                                            placeholder='Write something...'
                                            size='sm'
                                            minHeight="100px"  // Minimum height to start with
                                            height='auto'  // Set height to auto to allow resize
                                            overflow='hidden'  // Hide the scrollbar
                                        />
                                    </TabPanel>
                                    <TabPanel size='sm'>
                                        <Markdown remarkPlugins={[remarkGfm]} marginBottom='4' className="markdown" children={postText}
                                            components={{
                                                code({ node, inline, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '');
                                                    return !inline && match ? (
                                                        <SyntaxHighlighter
                                                            style={dracula}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            {...props}
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    ) : (
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                }
                                            }}
                                        />
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>




                        </FormControl>
                    </VStack>
                </Flex>
            </CardBody>

            <CardFooter>
                <FormControl>
                    <FormLabel htmlFor='file'>Attach media</FormLabel>
                    <InputGroup>
                        <Input
                            type='file'
                            id='file'
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="audio/*,video/*,image/*"
                            multiple  // Enable selection of multiple files
                            style={{ display: 'none' }}  // Hide the default input
                        />
                        <Button variant='outline' colorScheme='blue' leftIcon={<Icon as={AiOutlinePaperClip} />} onClick={triggerFileInput}>Choose File</Button>
                    </InputGroup>
                    {files.length > 0 && (
                        <List mt={2}>
                            {files.map((file, index) => (
                                <ListItem key={index}>
                                    <HStack spacing={4} maxW={'30%'} >
                                        <Text flex="1">{file.name}</Text>
                                        <CloseButton onClick={() => handleRemoveFile(index)} />
                                    </HStack>
                                </ListItem>
                            ))}
                        </List> //TODO
                    )}
                    <ModalFooter>
                        <Button
                            id='add-post'//new
                            colorScheme="blue" mr={-7} mb={-5} onClick={() => {
                                handleSubmit();
                                navigate("/home");
                            }}>POST</Button>
                    </ModalFooter>
                </FormControl>
            </CardFooter>
        </Card>
        // </Box>
    );
}

export default AddPost;