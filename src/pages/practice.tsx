import { Box, Grid, GridItem, Text, Button, VStack, Link, AbsoluteCenter, Input, Table, Stack, For } from "@chakra-ui/react"
import { InputGroup } from "@/components/ui/input-group"
import { FaSearch } from "react-icons/fa"
import { keyframes } from "@emotion/react";
import axios from "axios";
import {useState, useEffect} from "react";
import { GrNewWindow } from "react-icons/gr";

export default function SaunaApp() {
  const slideShow = keyframes`
  0%, 25% { background-image: url('/Images/ROOFTOPサ室.jpg'); }
  26%, 50% { background-image: url('/Images/サウナ東京.jpg'); }
  51%, 75% { background-image: url('/Images/ととのい.jpg'); }
  76%, 100% { background-image: url('/Images/totonoi.jpg'); }
`;
  
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
  <Box 
    h={"90vh"}
    bgSize="cover" // 背景を拡大して全体を覆う
    animation={`${slideShow} 20s infinite`} // アニメーション設定
    bgBlendMode="overlay" // 背景画像と青色を合成
    bgColor="blue.700" // 背景色を青に設定
    // opacity="0.7" // 全体の透明度を調整（任意）
    position="relative">
    <Box h={"10%"}>
      <Grid templateColumns="repeat(5, 1fr)">
        <GridItem colSpan={2}>
            <Link href="#" color="white" ml={10} mt={5}>ととのうとは？</Link>
            <Link href="#" color="white" ml={6} mt={3}>みんなのサ活</Link>
            <Link href="#" color="white" ml={6} mt={3}>サ活投稿</Link>
        </GridItem>
        <GridItem colSpan={2}>
        </GridItem>
        <GridItem colSpan={1}>
          <Button colorPalette="red" variant="solid" mt={3} ml={20}>ログアウト</Button>
        </GridItem>
      </Grid>
    </Box>

    <Box h="90%">
    <AbsoluteCenter>
      <VStack>
        <Text fontWeight="100" fontSize="xl" color="white">
          お気に入りのサウナ検索・サ活投稿ができるサイト
        </Text>
        <Text fontWeight="1000" fontSize="7xl" color="white" textShadow="3px 3px 10px white">
          サウナ
        </Text>
        <Text fontWeight="1000" fontSize="7xl" color="white" textShadow="3px 3px 10px white">
          ツアーズ
        </Text>
        <InputGroup width="sm" flex="1" startElement={<FaSearch />}>
          <Input placeholder="Let's search SAUNA!" bg="white" color="black"/>
        </InputGroup>
      </VStack>
    </AbsoluteCenter>
    </Box>
  </Box>

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
