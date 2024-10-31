import React, {useState, useEffect} from 'react';
import {
    Button,
    Box,
    Input,
    Stack,
    Flex,
    VStack, useToast
} from '@chakra-ui/react';
import Comment from "../Commentss/Comment";
import ApiCalls from '../ApiCalls';
import {useAuth} from '../AuthProvider';

export default function CommentForm({content}) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [isEditMode, setEditMode] = useState(false);
    const [editableComment, setEditableComment] = useState({});
    const {user} = useAuth();
    const toast = useToast();

    async function getComments() {
        try {
            const response = await ApiCalls.get(content._links.comments.href);
            const data = response.data;
            if (data?._embedded?.commentList != null) {
                setComments(data?._embedded?.commentList);
            }
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        }
    }

    function editMode(comment) {
        setEditMode(true);
        setEditableComment(comment);
        setText(comment.textData);
    }

    async function addComment() {
        if (text == null || text == "")
            return;
        try {
            const formData = new FormData();
            formData.append('text', text);
            formData.append('commenter', user);
            const response = await ApiCalls.post(content._links.comments.href, formData);
            const data = response.data;
            console.log("data from frontend" + data);
            setComments([...comments, data]);
            setText("");
            toast({
                title: 'Comment Added Successfully!',
                description: "Comment Added.",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: `top`
            });

        } catch (error) {
            toast({
                title: 'Error Occured.',
                description: "Unable to add comment at this time.",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: `top`
            });
        }
    }

    async function editComment(comment, newText) {
        try {

            const formData = new FormData();
            formData.append('text', newText);
            const response = await ApiCalls.put(comment._links?.self.href, formData);
            const data = response.data;
            const updatedComments = comments.filter(c => c.contentID !== comment.contentID);
            setComments([...updatedComments, data]);
            console.log("data from frontend" + data);
            //setComments([...comments, data]);
            setEditMode(false);
            setText("");

            toast({
                title: 'Comment Edited Successfully!',
                description: "Comment Edited.",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: `top`
            });

        } catch (error) {
            toast({
                title: 'Error Occured.',
                description: "Unable to add comment at this time.",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: `top`
            });
        }
    }

    async function DeleteComment(comment) {
        try {
            const response = await ApiCalls.delete(comment._links?.self.href);
            const data = response.data;
            const updatedComments = comments.filter(c => c.contentID !== comment.contentID);
            setComments(updatedComments);
            toast({
                title: 'Comment Deleted Successfully!',
                description: "Comment Deleted.",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: `top`
            });

        } catch (error) {
            toast({
                title: 'Error Occured.',
                description: "Unable to delete comment at this time.",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: `top`
            });
        }
    }


    // Fetch comments when the component mounts
    useEffect(() => {
        getComments();
    }, [content]);

    return (
        <Flex
            align={'center'}
            justify={'center'}
            w={'full'}


        >

            <Box
                w={'full'}
                maxW={'md'}
                // bg={useColorModeValue('white', 'gray.800')}

                // rounded={'xl'}
                // boxShadow={'lg'}

                my={10}
            >


                <VStack
                    spacing={4}
                    overflowY="scroll"
                    maxH="60vh"
                    pr={2}
                    w="full">

                    {comments.map((comment) => (
                        <Comment key={comment.contentID} comment={comment} deleteFunction={() => DeleteComment(comment)}
                                 editMode={editMode}/>
                    ))}
                </VStack>


                {/*<Box py={4}>*/}
                {/*  <hr />*/}
                {/*</Box>*/}


                <Stack
                    mt={3}
                    spacing={4}
                    align={'flex-end'}
                    direction={['row']}>

                    <Input
                        id='comment-field' //new 
                        w={'75%'}
                        placeholder="Write a comment..."
                        _placeholder={{color: 'gray.500'}}
                        type="text"
                        onChange={e => setText(e.target.value)}
                        value={text}
                    />

                    <Button
                        id='submit-button' //new
                        bg={'blue.400'}
                        color={'white'}
                        w="25%"
                        _hover={{
                            bg: 'blue.500',
                        }}
                        onClick={() => isEditMode ? editComment(editableComment, text) : addComment()}
                    >
                        {isEditMode ? 'Edit' : 'Add'}
                    </Button>
                </Stack>
            </Box>
        </Flex>
    );
}
