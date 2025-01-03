import { Box, Grid, GridItem, Text, Button, VStack, Link, AbsoluteCenter, Input, Table, Stack, For } from "@chakra-ui/react"
import { InputGroup } from "@/components/ui/input-group"
import { FaSearch } from "react-icons/fa"
import { keyframes } from "@emotion/react";
import axios from "axios";
import {useState, useEffect} from "react";
import { GrNewWindow } from "react-icons/gr";

export default function SaunaApp() {

  const[posts,setPosts]=useState<Post[]>([]);
  const [content, setContent] = useState("");

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

// POSTリクエスト関数
async function addPost() {
  try {
    const url = "http://127.0.0.1:8000/posts";
    const newPost = {
      user_id: "test_user_id", // 仮のユーザーID（実際のユーザーIDを利用すること）
      sauna_id: "sample_sauna_id", // 仮のサウナID（実際のIDを利用すること）
      content, // ユーザー入力値
    };
    const response = await axios.post(url, newPost);
    console.log("Post added:", response.data);

    // 成功後、投稿一覧を再取得
    fetchPosts();
  } catch (err) {
    console.error("Error adding post:", err);
  }
}


  useEffect(()=>{fetchPosts()},[]);

  return (
    <Box h={"90vh"} m="4" p="3">
  <Text fontSize="3xl" textDecoration="underline">
    "ととのう"とは
  </Text>
  <Button onClick={fetchPosts} color="blue">
    Saunas
  </Button>

  {/* 投稿フォーム */}
  <Box my={6}>
    <Text fontSize="2xl" fontWeight="bold" mb={4}>
      新規投稿
    </Text>
    <VStack>
      <Input
        placeholder="投稿内容を入力してください"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button onClick={addPost} colorScheme="teal">
        投稿
      </Button>
    </VStack>
  </Box>

  {/* 投稿一覧テーブル */}
  <Box p={4}>
    <Text fontSize="2xl" fontWeight="bold" mb={4}>
      Posts Table
    </Text>
    <Box overflowX="auto">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>Content</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <tr key={post.id}>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {post.id}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {post.user_id}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {post.place_id}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {post.content}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {post.created_at}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                style={{ textAlign: "center", padding: "8px" }}
              >
                No posts available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Box>
  </Box>
</Box>

  );
}
