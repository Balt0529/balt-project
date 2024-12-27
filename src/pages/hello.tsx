import { Box, Text, Button, VStack, HStack, Input } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";

type User = {
  id: string;
  email: string;
  name: string;
};

type Post = {
  id: number;
  user_id: string;
  place_id: string;
  content: string;
  created_at: string;
};

export default function PostApp() {
  const [posts, setPosts] = useState([]);
  const [newPlace_id, setNewPlace_id] = useState(""); // 新しいサウナの場所
  const [newContent, setNewContent] = useState(""); // 新しい感想

  // データを取得する関数
  async function fetchPosts() {
    try {
      const res = await axios.get("http://127.0.0.1:8000/posts");
      setPosts(res.data); // データをステートに保存
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  }

  // 新しいメモを追加する関数
  const addPost = async () => {
    try {
      const newPost = {
        place_id: newPlace_id,
        content: newContent,
      };
      await axios.post("http://localhost:8000/posts", newPost);
      setNewPlace_id(""); // 入力欄をリセット
      setNewContent("");
      fetchPosts(); // メモ一覧を更新
    } catch (err) {
      console.error("メモ追加エラー:", err);
    }
  };


  // 初回レンダリング時にデータを取得
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
    <VStack mt={4} align="center">
      {/* 新しいメモを入力するフォーム */}
      <HStack>
        <Input
          placeholder="場所"
          value={newPlace_id}
          onChange={(e) => setNewPlace_id(e.target.value)}
        />
        <Input
          placeholder="内容"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <Button colorScheme="teal" onClick={addPost}>
          追加
        </Button>
      </HStack>

      {/* メモの一覧表示 */}
      <Box>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>タイトル</th>
              <th>内容</th>
              <th>タグ</th>
              <th>作成日時</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post: any) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.place_id}</td>
                <td>{post.content}</td>
                <td>{post.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      </VStack>
    </>
    
  );
}
