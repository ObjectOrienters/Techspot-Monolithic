import React from 'react';
import {
    Button, Flex, useToast, Text, Card,
    CardBody,
 
} from '@chakra-ui/react';
import { useAuth } from './AuthProvider';
import ApiCalls from './ApiCalls';


function DeletePost({ post }) { 

    const { user, token } = useAuth();
    const toast = useToast();



    const deletePost = async () => {
        try {
            console.log(`/profiles/${user}/posts/${post.contentID}`);
            await ApiCalls.delete(`/profiles/${user}/posts/${post.contentID}`);
            toast({
                title: 'Deleted Successfully.',
                description: "Post Deleted.",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: `top`
            });
        } catch (error) {
            toast({
                title: 'Error Deleting Post.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: `top`
            });
        }
    }

    return (

        <Card>

            <CardBody>
                <Text>Are you sure you want to delete?</Text>
            <Flex justifyContent="flex-end" width="100%">
                    <Button onClick={() => deletePost()} bg={'red'} color={'white'}>
                        Delete Post
                    </Button>
                </Flex>
            </CardBody>

        </Card>

    );
}

export default DeletePost;

