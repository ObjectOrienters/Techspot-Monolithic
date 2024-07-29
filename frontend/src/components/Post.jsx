import React, { useEffect, useState, forwardRef, useContext } from 'react';
import {
    Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Drawer,
    DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Flex,
    Heading, IconButton, Link, Menu, MenuButton, MenuItem, MenuList, Text,
    ModalCloseButton,
    Modal, useDisclosure,
    ModalBody,
    ModalOverlay,
    ModalContent,
    Divider,Toast
} from '@chakra-ui/react';

import { BiChat, BiLike, BiShare } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import MediaContentData from './MediaContentData';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './style.css'; // Import your custom CSS'
import { ReactionBarSelector } from '@charkour/react-reactions';
import Popup from 'reactjs-popup';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight';
import { dark, docco, dracula, gruvboxDark, lightfair, solarizedDark, solarizedLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useAuth } from './AuthProvider';
import ApiCalls from './ApiCalls';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faHeart, faFaceLaughSquint, faHandsClapping, faThumbsUp as solidThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as regularThumbsUp } from '@fortawesome/free-regular-svg-icons';

import useProfileLoading from './useProfileLoading';
import { useNavigate, useParams } from 'react-router-dom';
import AddSharedPost from './AddSharedPost';
import CommentForm from './Commentss/CommentForm';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import moment from 'moment';
import EditPost from './EditPost';
import DeletePost from './DeletePost';
import {grey} from "@mui/material/colors";

const Post = forwardRef(({ post, sharedPost }, ref) => {
    const [profilePicUrl, setProfilePicUrl] = useState(null);
    const { profile } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [isReacted, setIsReacted] = useState(false);
    const [reaction, setReaction] = useState('like');
    const [reactionCount, setReactionCount] = useState(post.numOfReactions);
    const [commentsCount, setCommentsCount] = useState(post.numOfComments);
    const [sharesCount, setSharesCount] = useState(post.numOfShares);
    const [reactors, setReactors] = useState([]);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isSecondDrawerOpen, onOpen: onSecondDrawerOpen, onClose: onSecondDrawerClose } = useDisclosure();

    const { profileData } = useProfileLoading({ profile });
    const { isOpen: isOpenY, onOpen: onOpenY, onClose: onCloseY } = useDisclosure();
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
    const { isOpen: isOpenComment, onOpen: onOpenComment, onClose: onCloseComment } = useDisclosure();


    // const fetchReactors = async (postId, reactionType) => {
    //     try {
    //         const response = await ApiCalls.get(`http://localhost:8080/content/${postId}/reactions/${reactionType}/users`);
    //         const data = response.data;
    //         console.log('Reactors data:', data);
    //         setReactors(data?._embedded?.userList); // Adjust according to your actual response structure
    //     } catch (error) {
    //         Toast({
    //             title: 'Failed to fetch reactors.',
    //             description: `Error: ${error.message}`,
    //             status: 'error',
    //             duration: 2000,
    //             isClosable: true,
    //             position: 'top',
    //         });
    //     }
    // };

    const toProperCase = (str) => {
        if (str == null) return null;
        return str.toLowerCase().replace(/\b\w/g, function (char) {
            return char.toUpperCase();
        });
    };

    useEffect(() => {
        if (post?.contentAuthor?.profilePic) {
            const mimeType = post?.contentAuthor?.profilePic.type || 'application/octet-stream';
            const url = post.contentAuthor?.profilePic?.fileUrl;
            setProfilePicUrl(url);
        }
    }, [post?.contentAuthor?.profilePic]);

    useEffect(() => {
        async function fetchData() {
            const response = await ApiCalls.get('/content/' + post.contentID + '/reactions/' + user);
            const data = await response.data;

            if (data.isReactor === true) {
                setIsReacted(true);
                setReaction(data.reactionType.toLowerCase());
            } else {
                setIsReacted(false);
            }
        }
        fetchData();
    }, []);


    const toggleReaction = async () => {
        const willBeReacted = !isReacted;
        setIsReacted(willBeReacted);
        try {
            if (willBeReacted) {
                await addReaction();
            } else {
                await removeReaction();
            }
        } catch (error) {
            console.error("Error in toggling reaction:", error);
            Toast({
                title: 'Error toggling reaction',
                description: `Error: ${error.message}`,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top',
            });
            setIsReacted(!willBeReacted);
        }
    };


    const addReaction = async () => {
        try {
            const postData = {
                reactorID: user,
                reactionType: reaction.toUpperCase(),
            };
            let uri = sharedPost && sharedPost.contentType === 'Post' ?
                post._links?.reactions?.href :
                sharedPost._links?.sub_reactions?.href;

            if (!uri) {
                throw new Error("URI for adding reaction is undefined");
            }

            const response = await ApiCalls.post(uri, postData);
            console.log('Reaction added:', response.data);
            if (!isReacted) setReactionCount(prev => prev + 1);
            setIsReacted(true);
        } catch (error) {
            console.error("Error adding reaction:", error);
            Toast({
                title: 'Failed to add reaction',
                description: `Error: ${error.message}`,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top',
            });
        }
    };

    const removeReaction = async () => {
        try {
            let uri = sharedPost && sharedPost.contentType === 'Post' ?
                post._links?.deleteReaction?.href :
                sharedPost._links?.sub_deleteReaction?.href;
            console.log('Post:', post);
            console.log('SharedPost:', sharedPost);

            console.log('URI:', uri);

            if (!uri) {
                throw new Error("URI for removing reaction is undefined");
            }

            const response = await ApiCalls.delete(uri);
            console.log('Reaction removed:', response.data);
            if (isReacted) setReactionCount(prev => prev - 1);
            setIsReacted(false);
        } catch (error) {
            console.error("Error removing reaction:", error);
            Toast({
                title: 'Failed to remove reaction',
                description: `Error: ${error.message}`,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top',
            });
        }
    };



    const getIcon = () => {
        if (!isReacted) return <FontAwesomeIcon icon={regularThumbsUp} />;

        switch (reaction) {
            case 'like':
                return <FontAwesomeIcon icon={solidThumbsUp} />;
            case 'dislike':
                return <FontAwesomeIcon icon={faThumbsDown} />;
            case 'love':
                return <FontAwesomeIcon icon={faHeart} />;
            case 'support':
                return <FontAwesomeIcon icon={faHandsClapping} />;
            case 'haha':
                return <FontAwesomeIcon icon={faFaceLaughSquint} />;
            default:
                return <FontAwesomeIcon icon={regularThumbsUp} />;
        }
    };





    const specificDateTime = new Date(post.timestamp);
    const userTimezoneOffset = specificDateTime.getTimezoneOffset() * 60000;
    const localTime = new Date(specificDateTime.getTime() - userTimezoneOffset);
    const duration = moment(localTime).fromNow();


    // const Reactor = function ({ name, profilePicUrl }) {
    //     return (
    //         <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
    //             <Avatar name={name} src={profilePicUrl || undefined} />
    //             <Box alignItems="left">
    //                 <Heading size='sm' textAlign={['left']}>{toProperCase(name)}</Heading>
    //             </Box>
    //         </Flex>
    //     )
    // }

    return (
        <>
            <Card ref={ref} key={post.contentID}  mt={5} w={'100%'}>
                <CardHeader marginBottom='-6'>
                    <Flex spacing='4'>
                        <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                            <Avatar name={post.contentAuthor?.name} src={profilePicUrl || undefined} onClick={() => navigate(`/profiles/${post.contentAuthor.username}`)} cursor={'pointer'} />
                            <Box alignItems="left">
                                <Heading size='sm' textAlign={['left']}>{toProperCase(post.contentAuthor?.name)}</Heading>
                                <Text fontSize='0.8em' textAlign={['left']}>{toProperCase(post.contentAuthor?.profession)}</Text>
                                <Text fontSize='0.7em' textAlign={['left']} color={'gray'}>{duration}</Text>
                            </Box>
                        </Flex>
                        {user == post.contentAuthor?.username && <Menu isLazy>
                            <MenuButton
                                as={IconButton}
                                variant='ghost'
                                colorScheme='gray'
                                aria-label='See menu'
                                icon={<BsThreeDotsVertical />}
                            />
                            <MenuList>
                                <MenuItem onClick={onOpenEdit}>Edit Post</MenuItem>
                                <MenuItem color='red' onClick={onOpenDelete}>Delete Post</MenuItem>
                            </MenuList>
                        </Menu>}
                    </Flex>
                </CardHeader>
                <CardBody textAlign={'left'}>
                    <Markdown

                        remarkPlugins={[remarkGfm]}
                        className="markdown"
                        children={post.textData}
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
                            },
                        }}
                    />
                    {Array.isArray(post.mediaData) && post.mediaData.length > 0 && <MediaContentData style={{ margin: 'auto' }} objectFit='cover' mediaData={post.mediaData} />}
                    <Flex justifyContent="flex-start" pt={50}>
                        {/* <Link size={'xs'} color={'gray'} textDecor={'underline'} onClick={onSecondDrawerOpen}>view reactions</Link> */}
                    </Flex>
                </CardBody>
                <CardFooter
                    marginTop='-9'
                    marginBottom='-3'
                    justify='space-between'
                    flexWrap='nowrap'
                    sx={{
                        '& > button': {
                            minW: '50',
                        },
                    }}
                >
                    {/*<Popup*/}
                    {/*    trigger={*/}
                    {/*        <Button flex='1' variant='ghost' leftIcon={getIcon()} colorScheme={isReacted ? 'blue' : null} onClick={() => { setReaction('like'); toggleReaction(); }}>*/}
                    {/*            <Box as="span" mr="2">{reactionCount}</Box> Like*/}
                    {/*        </Button>*/}
                    {/*    }*/}
                    {/*    position='top center'*/}
                    {/*    on='hover'*/}
                    {/*    closeOnDocumentClick*/}
                    {/*    mouseLeaveDelay={300}*/}
                    {/*    mouseEnterDelay={0}*/}
                    {/*    contentStyle={{ padding: '0px', border: 'none' }}*/}
                    {/*    arrow={false}*/}
                    {/*>*/}
                    {/*    <ReactionBarSelector*/}
                    {/*        reactions={[*/}
                    {/*            { label: 'like', node: <div>👍</div>, key: 'like' },*/}
                    {/*            { label: 'dislike', node: <div>👎</div>, key: 'dislike' },*/}
                    {/*            { label: 'love', node: <div>❤️</div>, key: 'love' },*/}
                    {/*            { label: 'support', node: <div>👏</div>, key: 'support' },*/}
                    {/*            { label: 'haha', node: <div>😄</div>, key: 'haha' },*/}
                    {/*        ]}*/}
                    {/*        iconSize='20px'*/}
                    {/*        onSelect={(key) => {*/}
                    {/*            setReaction(key);*/}
                    {/*            addReaction();*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*</Popup>*/}
                    <Button flex='1' variant='ghost' leftIcon={getIcon()} colorScheme={isReacted ? 'blue' : null} onClick={() => { setReaction('like'); toggleReaction(); }}>
                        <Box as="span" mr="2">{reactionCount}</Box> Like
                    </Button>
                    <Button onClick={onOpenComment} flex='1' variant='ghost' leftIcon={<BiChat />}><Box as="span" mr="2">{commentsCount}</Box>
                        Comment
                    </Button>
                    <Button flex='1' variant='ghost' leftIcon={<BiShare />} onClick={onOpenY}>
                        Share
                    </Button>
                </CardFooter>
            </Card>
            <Modal isOpen={isOpenY} onClose={onCloseY} isCentered>
                <ModalOverlay />
                <ModalContent maxW="32vw">
                    <ModalCloseButton mr={'-10px'} mt={'2px'} />
                    <ModalBody m={"10px"}>
                        <AddSharedPost sharedPost={post} />
                    </ModalBody>
                </ModalContent>
            </Modal>



            <Modal isOpen={isOpenEdit} onClose={onCloseEdit} isCentered>
                <ModalOverlay />
                <ModalContent maxW="32vw">
                    <ModalCloseButton mr={'-10px'} mt={'2px'} />
                    <ModalBody m={"10px"}>
                        <EditPost post={post} />
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpenComment} onClose={onCloseComment} isCentered>
                <ModalOverlay />
                <ModalContent >
                    <ModalCloseButton mr={'-10px'} mt={'2px'} />
                    <ModalBody >
                        <CommentForm content={post} setCommentsCount={setCommentsCount}></CommentForm>
                    </ModalBody>
                </ModalContent>
            </Modal>


            <Modal isOpen={isOpenDelete} onClose={onCloseDelete} isCentered>
                <ModalOverlay />
                <ModalContent maxW="32vw">
                    <ModalCloseButton mr={'-10px'} mt={'2px'} />
                    <ModalBody m={"10px"}>
                        <DeletePost post={post} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
});





export default Post;

