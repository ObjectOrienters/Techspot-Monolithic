import React, { useState, useEffect } from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
    useColorModeValue,
    useToast,
    VStack,
    IconButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody
} from "@chakra-ui/react";
import { useNavigate, useParams } from 'react-router-dom';
import useProfileLoading from './useProfileLoading';
import ProfilePosts from './ProfilePosts';
import { useAuth } from './AuthProvider';
import ApiCalls from './ApiCalls';
import { BsThreeDotsVertical } from 'react-icons/bs';
import EditProfile from './EditProfile';
import { FaRegEdit } from "react-icons/fa";




function ProfilePage() {
    const { profile } = useParams();
    const navigate = useNavigate();
    const { profileData } = useProfileLoading({ profile });
    const { user } = useAuth();
    const toast = useToast();
    const [FollowersNumber, setFollowersNumber] = useState(0);
    const [FollowingNumber, setFollowingNumber] = useState(0);
    const [PostsNumber, setPostsNumber] = useState(0);
    const [isOwner, setIsOwner] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isHovering, setIsHovering] = useState(false);

    // if(profileData === null){
    //     navigate('/NotFoundPage');
    // }

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);


    useEffect(() => {
        if (profile !== user) {
            const fetchFollower = async () => {
                try {
                    const response = await ApiCalls.get(`/profiles/${profile}/follower?followerUserName=${encodeURIComponent(user)}`);
                    setIsFollowing(response.data?.username === user);
                } catch (error) {
                    //console.error('Error:', error);
                }
            };
            fetchFollower();
        }
    }, [profile, user]);




    useEffect(() => {
        console.log("profile " + profile);
        console.log("user " + user);
        if (profile === user) {
            setIsOwner(true);
        }
    }, [profile, user]);



    const toggleFollower = async () => {
        if (isFollowing)
            handleDeleteFollower();
        else
            handleAddFollower();
    }


    function handleBackgroundChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        ApiCalls.post(`/profiles/${profile}/backgroundImg`, formData, {
        })
            .then(response => {
                toast({
                    title: 'Background Image Updated.',
                    description: 'What a nice background!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                toast({
                    title: 'Error Updating Background Image.',
                    description: 'Please try again later.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            });
    }


    function handleAddFollower() {
        const follower = { username: user };

        ApiCalls.post(`/profiles/${profile}/followers`, follower)
            .then(response => {
                setIsFollowing(true);
                toast({
                    title: `Following ${profile}.`,
                    description: `You are now following ${profile}.`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                toast({
                    title: `Error Following ${profile}.`,
                    description: `Unable to follow the ${profile} at this time.`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            });
    }

    function handleDeleteFollower() {
        const data = { deletedUser: user };

        ApiCalls.delete(`/profiles/${profile}/followers`, { data: data })
            .then(response => {
                setIsFollowing(false);
                toast({
                    title: `Unfollowed ${profile}.`,
                    description: `You have unfollowed ${profile}.`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                toast({
                    title: `Error unfollowing ${profile}.`,
                    description: `Unable to unfollow ${profile} at this time.`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            });
    }

    function handleProfilePicChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        ApiCalls.post(`/profiles/${profile}/profilePic`, formData, {
        })
            .then(response => {
                toast({
                    title: 'Profile Picture Updated.',
                    description: 'What a nice background!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                toast({
                    title: 'Error Updating Profile Picture.',
                    description: 'Please try again later.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            });
    }

    useEffect(() => {
        const fetchFollowers = async () => {
            if (profileData?._links?.followers?.href) {
                try {
                    const response = await ApiCalls.get(profileData._links.followers.href);
                    const data = response.data;
                    setFollowersNumber(data.page.totalElements);
                } catch (error) {
                    console.error("Failed to fetch followers:", error);
                }
            }
        };

        fetchFollowers();
    }, [user, profileData]);

    useEffect(() => {
        const fetchFollowing = async () => {
            if (profileData?._links?.following?.href) {
                try {
                    const response = await ApiCalls.get(profileData._links.following.href);
                    const data = response.data;
                    setFollowingNumber(data.page.totalElements);
                } catch (error) {
                    console.error("Failed to fetch following:", error);
                }
            }
        };

        fetchFollowing();
    }, [user, profileData]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (profileData?._links?.Posts?.href) {
                try {
                    const response = await ApiCalls.get(profileData._links.Posts.href);
                    const data = response.data;
                    setPostsNumber(data.page.totalElements);
                } catch (error) {
                    console.error("Failed to fetch following:", error);
                }
            }
        };

        fetchPosts();
    }, [user, profileData]);

    return (
        <>
        
        <Card w={'100%'} >
                <CardHeader>

                    <Box
                    textAlign={'left'}
                        w={'100%'}
                        bg={useColorModeValue('white', 'gray.800')}
                        // boxShadow={'2xl'}
                        overflow={'hidden'}>
                        <div style={{ position: 'relative', width: 'full', height: '200px' }}>
                            <Image
                                alt={'Profile background'}
                                h={'200px'}
                                w={'full'}
                                src={profileData && profileData.backgroundImg ? profileData.backgroundImg.fileUrl : '/images/bg.jpg'}
                                objectFit={'cover'}
                            />

                            {isOwner && <label style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                cursor: 'pointer'
                            }}>
                                <img src="/images/edit.png" alt="Edit" style={{ width: '20px', height: '20px' }} />
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleBackgroundChange}
                                    accept="image/*"
                                />

                            </label>}
                        </div>
                        <Flex justify={'left'} mt={-10} ml={2}>
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <Avatar
                                    size={'2xl'}
                                    name={profileData ? profileData.name : 'No Name'}
                                    src={profileData?.profilePic?.fileUrl}
                                    alt={'Profile picture'}
                                    css={{
                                        border: '2px solid white',
                                    }}
                                />
                                {isOwner &&<label style={{
                                    position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    cursor: 'pointer',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '50%',
                                    padding: '5px'
                                }}>
                                    <img src="/images/edit.png" alt="Edit" style={{ width: '24px', height: '24px' }} />
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={handleProfilePicChange}
                                        accept="image/*"
                                    />
                                </label>}
                            </div>

                        </Flex>
                        <VStack align="left" p={6} spacing={4}>
                            <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                                {profileData ? profileData.name : 'No Name'}
                                {isOwner && (
                                    <IconButton onClick={onOpen} mx={1} variant='ghost' icon={<FaRegEdit size={'23px'} />} />
                                )}
                            </Heading>
                            <Text fontSize={'xl'} color={'gray.500'}>
                                @{profileData && profileData.username ? profileData.username : 'null'}
                            </Text>
                            <Text fontSize={'md'} color={'gray.500'}>
                                {profileData && profileData.profession ? profileData.profession : 'No Profession'}
                            </Text>


                            <Stack direction={'row'} spacing={6}>


                                <Stack spacing={0} align={'center'}>
                                    <Text fontSize={'lg'} fontWeight={600}>{PostsNumber}</Text>
                                    <Text variant='link'
                                    >Posts</Text>
                                </Stack>
                                <Stack spacing={0} align={'center'}>
                                    <Text fontSize={'lg'} fontWeight={600}>{FollowersNumber}</Text>
                                    <Text variant='link'
                                        onClick={() => navigate('/profiles/' + profile + '/posts-followers-following?tab=followers')} cursor={'pointer'}>Followers</Text>
                                </Stack>
                                <Stack spacing={0} align={'center'}>
                                    <Text fontSize={'lg'} fontWeight={600}>{FollowingNumber}</Text>
                                    <Text variant='link'
                                        onClick={() => navigate('/profiles/' + profile + '/posts-followers-following?tab=following')} cursor={'pointer'}>Following</Text>
                                </Stack>
                            </Stack>
                            <Stack mt={8} direction={'row'} spacing={4} width="full">
                                {!isOwner && (
                                    <><Button

                                        fontSize={'lg'}
                                        rounded={'full'}
                                        _focus={{
                                            bg: 'gray.200',
                                        }}
                                        onClick={() => navigate(`/messages/${profile}`)}
                                    >
                                        Message
                                    </Button><Button
                                        fontSize={'lg'}
                                        rounded={'full'}
                                        bg={'blue.400'}
                                        color={'white'}
                                        boxShadow={'0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        _hover={
                                            {
                                                bg: isFollowing ? 'Red' : 'blue.700',
                                            }}
                                        onClick={toggleFollower}
                                    >
                                            {isHovering ? (isFollowing ? 'Unfollow' : 'Follow') : (isFollowing ? 'Following' : 'Follow')}
                                        </Button></>
                                )}
                            </Stack>
                            <Stack mt={7}>
                                <Heading fontSize={'xl'} fontWeight={500} fontFamily={'body'}>
                                    About
                                </Heading>
                                <Text fontSize={'sm'}>
                                    {profileData && profileData.about ? profileData.about : ''}
                                </Text>
                            </Stack>
                        </VStack>
                    </Box>
                </CardHeader>
                <CardBody>
                   
                </CardBody>
 
                <CardFooter>


                </CardFooter>
            </Card>
            <ProfilePosts user={profile} />
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent maxW="45vw" mt={6} h={'950px'}>
                    <ModalCloseButton  />
                    <ModalBody >
                        <EditProfile />
                    </ModalBody>
                </ModalContent>
            </Modal>

        </>
    );
}

export default ProfilePage;

