import React from 'react';
import {Avatar, Box, Text, Button, VStack, HStack, useToast, Divider, Icon} from "@chakra-ui/react";
import { useAuth } from '../AuthProvider';
import {DeleteIcon, EditIcon, EmailIcon} from "@chakra-ui/icons";
import moment from "moment/moment";


 function Comment({ comment, deleteFunction, editMode }) {
  const { user } = useAuth();
     const specificDateTime = new Date(comment.timestamp);
     const userTimezoneOffset = specificDateTime.getTimezoneOffset() * 60000;
     const localTime = new Date(specificDateTime.getTime() - userTimezoneOffset);
     const duration = moment(localTime).fromNow();
  console.log(comment);


  return (
      <Box w={'380px'} >
          <HStack spacing={4} align="top" p={3}>
              <Avatar size="sm" name={comment.contentAuthor?.name} src={comment.contentAuthor?.profilePic?.fileUrl}/>
              <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">{comment.contentAuthor?.name}</Text>
                  <Text fontSize='0.7em'  color={'gray'}>{duration}</Text>
                  <Text  whiteSpace="normal" wordBreak="break-word" mt={2} fontSize="sm">{comment.textData}</Text>
              </VStack>
              <HStack mt={12} ml={10}>
                  {comment?.contentAuthor?.username == user && <Button leftIcon={<DeleteIcon />} variant='ghost' onClick={deleteFunction}></Button>}
                  {comment?.contentAuthor?.username == user && <Button leftIcon={<EditIcon />} variant='ghost' onClick={() => {
                      editMode(comment)
                  }}></Button>}
              </HStack>

          </HStack>
          <hr />
      </Box>
  );
 }

export default Comment;
