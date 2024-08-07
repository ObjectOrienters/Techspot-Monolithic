import React, {useEffect, useState} from 'react';
import {Avatar, Box, Text, Button, VStack, HStack, useToast, Divider, Icon, Toast} from "@chakra-ui/react";
import { useAuth } from '../AuthProvider';
import {DeleteIcon, EditIcon, EmailIcon} from "@chakra-ui/icons";
import moment from "moment/moment";
import {ReactionBarSelector} from "@charkour/react-reactions";
import Popup from "reactjs-popup";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbsUp as regularThumbsUp} from "@fortawesome/free-regular-svg-icons";
import {
    faFaceLaughSquint,
    faHandsClapping,
    faHeart,
    faThumbsDown,
    faThumbsUp as solidThumbsUp
} from "@fortawesome/free-solid-svg-icons";
import ApiCalls from "../ApiCalls";


 function Comment({ comment, deleteFunction, editMode }) {

     const { user } = useAuth();
     const specificDateTime = new Date(comment.timestamp);
     const userTimezoneOffset = specificDateTime.getTimezoneOffset() * 60000;
     const localTime = new Date(specificDateTime.getTime() - userTimezoneOffset);
     const duration = moment(localTime).fromNow();
     const [isReacted, setIsReacted] = useState(false);
     const [reaction, setReaction] = useState(null);
     useEffect(() => {
         addReaction();
         console.log('Reaction:', reaction, "is", isReacted);
     }, [reaction]);


     useEffect(() => {
         async function fetchData() {
             const response = await ApiCalls.get('/content/' + comment.contentID + '/reactions/' + user);
             console.log('/content/' + comment.contentID + '/reactions/' + user);
             const data = await response.data;

             if (data.isReactor == true) {
                 setIsReacted(true);


                 setReaction(() => data.reactionType.toLowerCase());
             } else {
                 setIsReacted(false);


             }
         }
         fetchData();
     }, []);


     const addReaction = async () => {
         console.log('Content Id: ', comment.contentID);
         console.log('On add reaction: ', reaction);

         try {
             const reactionData = {
                 reactorID: user,
                 reactionType: reaction.toUpperCase(),
             };
             let uri = `/content/${comment.contentID}/reactions`

             if (!uri) {
                 throw new Error("URI for adding reaction is undefined");
             }
             console.log('URI:', uri);
             const response = await ApiCalls.post(uri, reactionData);
             console.log('Reaction added:', response.data);
             setIsReacted(true);


             console.log('Success:', response.data);
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
         console.debug("adding", isReacted);

     };

     const removeReaction = async () => {
         console.log('On remove reaction:', reaction);
         try {
             let uri = `/content/${comment.contentID}/reactions`
             console.log('Comment:', comment);

             console.log('URI:', uri);

             if (!uri) {
                 throw new Error("URI for removing reaction is undefined");
             }

             const response = await ApiCalls.delete(uri);
             console.log('Reaction removed:', response.data);
             setIsReacted(false);
             console.log('Success:', response.data);
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


     const toggleReaction = async (reactionType) => {
         console.log('On toggle reaction:', reaction);
         if (isReacted) await removeReaction();
         else setReaction(() => reactionType);

         console.log(" On toggle, reactionType", reactionType);

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


  return (
      <Box w={'380px'} >
          <HStack spacing={4} align="top" p={3}>
              <Avatar size="sm" name={comment.contentAuthor?.name} src={comment.contentAuthor?.profilePic?.fileUrl}/>
              <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">{comment.contentAuthor?.name}</Text>
                  <Text fontSize='0.7em'  color={'gray'}>{duration}</Text>
                  <Text  whiteSpace="normal" wordBreak="break-word" mt={2} fontSize="sm">{comment.textData}</Text>
              </VStack>

          </HStack>
          <HStack mt={1} ml={10}>
              <Popup

                  trigger={
                      <Button  variant='ghost' leftIcon={getIcon()} colorScheme={isReacted ? 'blue' : null}>Like</Button>
                  }
                  position='top center'
                  on='hover'
                  //closeOnDocumentClick
                  mouseLeaveDelay={300}
                  mouseEnterDelay={0}
                  contentStyle={{ padding: '0px', border: 'none' , zIndex: 1500}}
                  arrow={false}
              >
                  <ReactionBarSelector
                      reactions={[
                          { label: 'like', node: <div>👍</div>, key: 'like' },
                          { label: 'dislike', node: <div>👎</div>, key: 'dislike' },
                          { label: 'love', node: <div>❤️</div>, key: 'love' },
                          { label: 'support', node: <div>👏</div>, key: 'support' },
                          { label: 'haha', node: <div>😄</div>, key: 'haha' },
                      ]}
                      iconSize='20px'
                      onSelect={(key) => {
                          console.log(key);
                          toggleReaction(key);

                      }}
                  />
              </Popup>
              {comment?.contentAuthor?.username == user && <Button leftIcon={<EditIcon />} variant='ghost' onClick={() => {editMode(comment)}}></Button>}
              {comment?.contentAuthor?.username == user && <Button leftIcon={<DeleteIcon />} variant='ghost' onClick={deleteFunction}></Button>}
          </HStack>
          <hr />
      </Box>
  );
 }

export default Comment;
