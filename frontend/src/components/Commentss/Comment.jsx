import React, {useState} from 'react';
import {Avatar, Box, Text, Button, VStack, HStack, useToast, Divider, Icon} from "@chakra-ui/react";
import {useAuth} from '../AuthProvider';
import {DeleteIcon, EditIcon, EmailIcon} from "@chakra-ui/icons";
import moment from "moment/moment";
import {ReactionBarSelector} from "@charkour/react-reactions";
import Popup from "reactjs-popup";
import ApiCalls from "../ApiCalls";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbsUp as regularThumbsUp} from "@fortawesome/free-regular-svg-icons";
import {
    faFaceLaughSquint,
    faHandsClapping,
    faHeart,
    faThumbsDown,
    faThumbsUp as solidThumbsUp
} from "@fortawesome/free-solid-svg-icons";


function Comment({comment, deleteFunction, editMode}) {
    const {user} = useAuth();
    const [isReacted, setIsReacted] = useState(false);
    const [reaction, setReaction] = useState('like');
    const [reactionCount, setReactionCount] = useState(comment.numOfReactions);
    const specificDateTime = new Date(comment.timestamp);
    const userTimezoneOffset = specificDateTime.getTimezoneOffset() * 60000;
    const localTime = new Date(specificDateTime.getTime() - userTimezoneOffset);
    const duration = moment(localTime).fromNow();
    let uri = `/content/${comment.contentID}/reactions`;







    const addReaction = async () => {
        console.log('Postadd:', comment);

        try {
            const postData = {
                reactorID: user,
                reactionType: reaction.toUpperCase(),
            };



            console.log('URI:', uri);
            const response = await ApiCalls.post(uri, postData);
            console.log('Success:', response.data);
            if (!isReacted) setReactionCount((prev) => prev + 1);
            setIsReacted(true);
            console.log('Success:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const removeReaction = async () => {
        // try {
        //     console.log('Commentrem:', comment);
        //     console.log('URI:', uri);
        //     const response = await ApiCalls.delete(uri);
        //     if (isReacted) setReactionCount((prev) => prev - 1);
        //     setIsReacted(false);
        //     console.log('Success:', response.data);
        // } catch (error) {
        //     console.error('Error:', error);
        // }
    };

    const toggleReaction = async () => {
        if (isReacted)
            removeReaction();
        else
            addReaction();
        setIsReacted((prev) => !prev);
    };

    const getIcon = () => {
        if (!isReacted) return <FontAwesomeIcon icon={regularThumbsUp}/>;

        switch (reaction) {
            case 'like':
                return <FontAwesomeIcon icon={solidThumbsUp}/>;
            case 'dislike':
                return <FontAwesomeIcon icon={faThumbsDown}/>;
            case 'love':
                return <FontAwesomeIcon icon={faHeart}/>;
            case 'support':
                return <FontAwesomeIcon icon={faHandsClapping}/>;
            case 'haha':
                return <FontAwesomeIcon icon={faFaceLaughSquint}/>;
            default:
                return <FontAwesomeIcon icon={regularThumbsUp}/>;
        }
    };


    return (
        <Box w={'380px'}>
            <HStack spacing={4} align="top" p={3}>
                <Avatar size="sm" name={comment.contentAuthor?.name} src={comment.contentAuthor?.profilePic?.fileUrl}/>
                <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">{comment.contentAuthor?.name}</Text>
                    <Text fontSize='0.7em' color={'gray'}>{duration}</Text>
                    <Text whiteSpace="normal" wordBreak="break-word" mt={2} fontSize="sm">{comment.textData}</Text>
                </VStack>


            </HStack>
            <HStack mt={1} ml={10} spacing={-1}>
                <Popup
                    trigger={
                        <Button   variant='ghost' leftIcon={getIcon()}
                                colorScheme={isReacted ? 'blue' : null} onClick={() => {
                            setReaction('like');
                            toggleReaction();
                        }}>
                            <Box as="span" mr="2">{reactionCount}</Box>
                        </Button>
                    }
                    position='top center'
                    on='hover'
                    closeOnDocumentClick
                    mouseLeaveDelay={300}
                    mouseEnterDelay={0}
                    contentStyle={{padding: '0px', border: 'none'}}
                    arrow={false}

                >
                    <ReactionBarSelector
                        reactions={[
                            {label: 'like', node: <div>👍</div>, key: 'like'},
                            {label: 'dislike', node: <div>👎</div>, key: 'dislike'},
                            {label: 'love', node: <div>❤️</div>, key: 'love'},
                            {label: 'support', node: <div>👏</div>, key: 'support'},
                            {label: 'haha', node: <div>😄</div>, key: 'haha'},
                        ]}
                        iconSize='20px'
                        onSelect={(key) => {
                            setReaction(key);
                            addReaction();
                        }}
                    />
                </Popup>
                {comment?.contentAuthor?.username == user &&
                    <Button leftIcon={<EditIcon/>} variant='ghost' onClick={() => {
                        editMode(comment)
                    }}></Button>}
                {comment?.contentAuthor?.username == user &&
                    <Button leftIcon={<DeleteIcon/>} variant='ghost' onClick={deleteFunction}></Button>}
            </HStack>
            <hr/>
        </Box>
    );
}

export default Comment;
