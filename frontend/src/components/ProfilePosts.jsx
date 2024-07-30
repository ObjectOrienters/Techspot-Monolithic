import React, { useState, useEffect } from 'react';
import Post from './Post';
import SharedPost from './SharedPost';
import useProfileLoading from './useProfileLoading';
import { useAuth } from './AuthProvider';
import ApiCalls from './ApiCalls';
import PostList from './PostList';

function ProfilePosts({user}) {
    // const [posts, setPosts] = useState([]);
    // const [sharedPosts, setSharedPosts] = useState([]);
    // const [mixedPosts, setMixedPosts] = useState([]);
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);

    // const { user } = useAuth();
      const  profileData  = useProfileLoading({ profile: user });

  
    console.log("00000000000000000000000000000000000000",user);
    return (


        <PostList feedType='ONE_USER' feedValue={user} offset={0} limit={5} />

        // <>
        //     {mixedPosts.map((post, index) => {
        //         if (post.contentType === "Post") {
        //             if (mixedPosts.length === index + 1) {
        //                 return <Post
        //                     key={post.contentID || index}
        //                     post={post}
        //                 />
        //             } else {
        //                 return <Post
        //                     key={post.contentID || index}
        //                     post={post}
        //                 />
        //             }
        //         } else {
        //             return <SharedPost key={post.contentID} sharedPost={post} />

        //         }
        //     }
        //     )}
        // </>
    );
}

export default ProfilePosts;
