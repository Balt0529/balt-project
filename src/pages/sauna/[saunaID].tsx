// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { Box, Spinner, Text, Image } from "@chakra-ui/react";

// const SaunaDetail: React.FC = () => {
//   const router = useRouter();
//   const { saunaID } = router.query; // place_id を取得
//   const [sauna, setSauna] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

//   useEffect(() => {
//     if (!saunaID) return;

//     const fetchSaunaDetail = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(`http://127.0.0.1:8000/saunas/${saunaID}`);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         setSauna(data);
//       } catch (err) {
//         console.error(err);
//         setError("サウナの情報を取得できませんでした。");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSaunaDetail();
//   }, [saunaID]);

//   if (loading) {
//     return <Spinner size="xl" />;
//   }

//   if (error) {
//     return <Text color="red.500">{error}</Text>;
//   }

//   return (
//     <Box p={4}>
//       {sauna ? (
//         <>
//           <Text fontSize="2xl" fontWeight="bold">{sauna.name}</Text>
//           <Text>住所: {sauna.address}</Text>
//           <Text>評価: {sauna.rating || "評価なし"}</Text>
//           {sauna.photos && sauna.photos.length > 0 && (
//             <Image
//               src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${sauna.photos[0].photo_reference}&key=${googleMapsApiKey}`}
//               alt={sauna.name}
//               mt={4}
//             />
//           )}
//         </>
//       ) : (
//         <Text>サウナの情報が見つかりません。</Text>
//       )}
//     </Box>
//   );
// };

// export default SaunaDetail;

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Spinner,
  Text,
  Image,
  VStack,
  Input,
  Button,
  Table,
} from "@chakra-ui/react";
import axios from "axios";

const SaunaDetail: React.FC = () => {
  const router = useRouter();
  const { saunaID } = router.query; // place_id を取得
  const [sauna, setSauna] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState<string>("");
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const userID = "test_user_id"; // Google 認証から得たユーザーID（ここを置き換える）

  // サウナの詳細を取得
  useEffect(() => {
    if (!saunaID) return;

    const fetchSaunaDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://127.0.0.1:8000/saunas/${saunaID}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSauna(data);
      } catch (err) {
        console.error(err);
        setError("サウナの情報を取得できませんでした。");
      } finally {
        setLoading(false);
      }
    };

    fetchSaunaDetail();
  }, [saunaID]);

  // 投稿一覧を取得
  useEffect(() => {
    if (!saunaID) return;

    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/posts?sauna_id=${saunaID}`
        );
        setPosts(response.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };

    fetchPosts();
  }, [saunaID]);

  // 投稿を追加
  const addPost = async () => {
    if (!content.trim()) {
      alert("投稿内容を入力してください。");
      return;
    }

    try {
      const newPost = {
        user_id: userID,
        sauna_id: saunaID,
        content,
      };

      await axios.post("http://127.0.0.1:8000/posts", newPost);

      // 投稿一覧を更新
      setPosts((prevPosts) => [
        {
          ...newPost,
          created_at: new Date().toISOString(),
          id: Math.random(), // 仮のID（サーバーからの応答で取得することを推奨）
        },
        ...prevPosts,
      ]);

      setContent(""); // 入力欄をリセット
    } catch (err) {
      console.error("Failed to add post:", err);
      alert("投稿に失敗しました。");
    }
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Box p={4}>
      {sauna ? (
        <>
          <Text fontSize="2xl" fontWeight="bold">{sauna.name}</Text>
          <Text>住所: {sauna.address}</Text>
          <Text>評価: {sauna.rating || "評価なし"}</Text>
          {sauna.photos && sauna.photos.length > 0 && (
            <Image
              src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${sauna.photos[0].photo_reference}&key=${googleMapsApiKey}`}
              alt={sauna.name}
              mt={4}
            />
          )}

          {/* 投稿フォーム */}
          <Box mt={8}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              投稿を追加
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

          {/* 投稿一覧 */}
          <Box mt={8}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              投稿一覧
            </Text>
            <table>
              <thead>
                <tr>
                  <th>作成日時</th>
                  <th>投稿内容</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>{new Date(post.created_at).toLocaleString()}</td>
                    <td>{post.content}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </>
      ) : (
        <Text>サウナの情報が見つかりません。</Text>
      )}
    </Box>
  );
};

export default SaunaDetail;

