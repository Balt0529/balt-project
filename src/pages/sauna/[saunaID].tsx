import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Spinner,
  Text,
  Image,
  Textarea,
  Button,
  Flex,
  VStack,
} from "@chakra-ui/react";
import supabase from "@/libs/supabase";

// サウナの型定義
type Sauna = {
  id: string;
  name: string;
  address: string;
  rating?: number;
  latitude?: string;
  longitude?: string;
  photos?: { photo_reference: string }[];
};

type Post = {
  id: number;
  content: string;
  created_at: string;
};

const SaunaDetail: React.FC = () => {
  const router = useRouter();
  const { saunaID } = router.query;
  const [sauna, setSauna] = useState<Sauna | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [userID, setUserID] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  

  useEffect(() => {
    const fetchUserID = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("セッション取得エラー:", error);
        return;
      }

      if (session?.user) {
        setUserID(session.user.id);
      } else {
        console.warn("ユーザー情報が見つかりません");
      }
    };

    fetchUserID();
  }, []);


  const handleAddFavorite = async () => {
    if (!userID || !saunaID) {
      alert("ユーザー情報またはサウナ情報が不足しています。");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userID,
          sauna_id: saunaID,
        }),
      });

      if (!response.ok) {
        throw new Error(`お気に入り追加に失敗しました: ${response.status}`);
      }

      alert("お気に入りに追加しました！");
    } catch (err) {
      alert(`お気に入り追加に失敗しました: ${(err as Error).message}`);
    }
  };


  


  useEffect(() => {
    if (!saunaID) return;

    const fetchSaunaDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/saunas/${saunaID}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Sauna = await response.json();
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

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/posts?sauna_id=${saunaID}`
      );
      if (!response.ok) {
        throw new Error(`投稿情報の取得に失敗しました: ${response.status}`);
      }
      const data: Post[] = await response.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (saunaID) {
      fetchPosts();
    }
  }, [saunaID]);

  useEffect(() => {
    if (sauna && sauna.latitude && sauna.longitude && mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: parseFloat(sauna.latitude), lng: parseFloat(sauna.longitude) },
        zoom: 17,
      });

      new google.maps.Marker({
        position: { lat: parseFloat(sauna.latitude), lng: parseFloat(sauna.longitude) },
        map,
        title: sauna.name,
      });
    }
  }, [sauna]);

  const handlePost = async () => {
    if (!content.trim()) {
      alert("投稿内容が空です。入力してください。");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userID,
          sauna_id: saunaID,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error(`投稿に失敗しました: ${response.status}`);
      }

      alert("投稿が完了しました！");
      setContent("");
      fetchPosts();
    } catch (err) {
      alert(`投稿に失敗しました: ${(err as Error).message}`);
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`削除に失敗しました: ${response.status}`);
      }

      alert("投稿を削除しました！");
      fetchPosts();
    } catch (err) {
      alert(`削除に失敗しました: ${(err as Error).message}`);
    }
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Box p={10}>
      {sauna ? (
        <>
          <Flex align="flex-start" gap={8}>
            <Box flex="1">
              <Text fontSize="2xl" fontWeight="bold" mb={4}>
                {sauna.name}
              </Text>
              <Text mb={2}>住所: {sauna.address}</Text>
              <Text mb={8}>評価: {sauna.rating || "評価なし"}</Text>
              <Button
  color="blue"
  bg="white"
  border="2px solid blue" // 外枠を青色に設定
  borderRadius="md" // ボタンの角を丸める
  onClick={handleAddFavorite}
  disabled={!userID || !saunaID}
  _hover={{ bg: 'blue.100' }} // ホバー時の背景色
  _disabled={{ opacity: 0.6, cursor: 'not-allowed' }} // 無効化時のスタイル
>
  お気に入りに追加
</Button>
            </Box>
            <Box
              ref={mapRef}
              height="300px"
              flex="1"
              borderWidth="1px"
              borderRadius="md"
              overflow="hidden"
            />
          </Flex>
          <VStack align="stretch" mt={6}>
            {sauna.photos && sauna.photos.length > 0 && (
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  サウナの写真
                </Text>
                <Flex flexWrap="wrap" gap={4}>
                  {sauna.photos.map((photo, index) => (
                    <Image
                      key={index}
                      src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${googleMapsApiKey}`}
                      alt={`${sauna.name}の写真${index + 1}`}
                      borderRadius="md"
                      width="200px"
                      height="150px"
                      objectFit="cover"
                    />
                  ))}
                </Flex>
              </Box>
            )}
            <Box>
              <Text fontSize="lg" fontWeight="bold" mt={10}>
                サ活を投稿する
              </Text>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="サウナでの体験を投稿してください！"
                mt={2}
                resize="none"
              />
              <Button
                colorScheme="teal"
                mt={2}
                onClick={() => handlePost()}
                disabled={!userID || !saunaID}
              >
                投稿する
              </Button>
            </Box>
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={2} mt={10}>
                投稿一覧
              </Text>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Box
                    key={post.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    mb={4}
                    shadow="sm"
                  >
                    <Text>{post.content}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(post.created_at).toLocaleString()}
                    </Text>
                    <Button
                      colorScheme="red"
                      size="sm"
                      mt={2}
                      onClick={() => handleDelete(post.id)}
                    >
                      削除
                    </Button>
                  </Box>
                ))
              ) : (
                <Text mt={4}>まだ投稿がありません。</Text>
              )}
            </Box>
            <Box display="flex" justifyContent="center" mt={10}>
            <Button
                onClick={() => router.push("/mypage")}
                fontSize="md"
                color="black"
                bg="yellow.200"
                h="50px"
                w="300px"
                _hover={{ bg: "gray.200" }}
              >
                マイページに戻る
              </Button>
            </Box>
          </VStack>
        </>
      ) : (
        <Text>サウナの情報が見つかりません。</Text>
      )}
    </Box>
  );
};

export default SaunaDetail;
