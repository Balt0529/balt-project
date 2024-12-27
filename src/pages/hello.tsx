import { Box, Grid, GridItem, Text, Button, VStack, Link, AbsoluteCenter, Input, Table, Stack, For } from "@chakra-ui/react"
import { InputGroup } from "@/components/ui/input-group"
import { FaSearch } from "react-icons/fa"
import { keyframes } from "@emotion/react";
import axios from "axios";
import {useState, useEffect} from "react";
import { GrNewWindow } from "react-icons/gr";

export default function SaunaApp() {

  const[posts,setPosts]=useState<Post[]>([]);

  type Post = {
    id: number;
    user_id: number;
    place_id: string;
    content: string;
    created_at: string;
  };

//GET
  async function fetchPosts() {
    try {
      const url = "http://127.0.0.1:8000/posts";
      const res = await axios.get(url);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  // //POST  
  // async function addPost(){
  //   try{
  //     const url = "http://127.0.0.1:8000/posts";
  //     const newPost={id:newID,user_id:newUser_id,place_id:newPlace_id,content:newContent,created_at:newCreated_at};
  //     await axios.post(url,newPost);
  //     setNewID("");
  //     setNewUser_id("");
  //     setNewPlace_id("");
  //     setNewContent("");
  //     setNewCreated_at("");
      
  //     HomePage();
  //   }catch(err){
  //     console.error(err);
  //   }
  // }

  useEffect(()=>{fetchPosts()},[]);

return (
  <>
  <Box h={"90vh"} m="4" p="3">
    <Text fontSize="3xl" textDecoration="underline">
      "ととのう"とは
    </Text>
    <Button onClick={SaunaApp} color='blue'>Sauna</Button>

    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Posts Table
      </Text>
      <Box overflowX="auto">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>ID</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>User ID</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Place ID</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Content</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id}>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{post.id}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{post.user_id}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{post.place_id}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{post.content}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{post.created_at}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "8px" }}>
                  No posts available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>
    </Box>
  </Box>
  </>
)
}
