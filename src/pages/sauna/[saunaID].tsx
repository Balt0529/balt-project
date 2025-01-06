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
  AbsoluteCenter,
} from "@chakra-ui/react";
import supabase from "@/libs/supabase";

const SaunaDetail: React.FC = () => {
  const router = useRouter();
  const { saunaID } = router.query; // Google Placesのplace_id
  const [sauna, setSauna] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string>(""); // 投稿内容
  const [userID, setUserID] = useState<string | null>(null); // Google認証のユーザーID
  const [posts, setPosts] = useState<any[]>([]); // 投稿一覧
  const [isFavorite, setIsFavorite] = useState<boolean>(false); // お気に入り状態
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef<HTMLDivElement>(null); // マップを表示する div の参照

  // Google認証情報を取得
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
        setUserID(session.user.id); // Google認証で取得したユーザーID
      } else {
        console.warn("ユーザー情報が見つかりません");
      }
    };

    fetchUserID();
  }, []);

  // サウナの詳細情報を取得
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

  // 投稿を取得
  const fetchPosts = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/posts?sauna_id=${saunaID}`);
      if (!response.ok) {
        throw new Error(`投稿情報の取得に失敗しました: ${response.status}`);
      }
      const data = await response.json();
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

  // 地図を初期化する
  useEffect(() => {
    if (sauna && sauna.latitude && sauna.longitude && mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: parseFloat(sauna.latitude), lng: parseFloat(sauna.longitude) },
        zoom: 14,
      });

      // ピンを立てる
      new google.maps.Marker({
        position: { lat: parseFloat(sauna.latitude), lng: parseFloat(sauna.longitude) },
        map,
        title: sauna.name,
      });
    }
  }, [sauna]);

  // 投稿処理
  const handlePost = async () => {
    if (!content.trim()) {
      alert("投稿内容が空です。入力してください。");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/posts", {
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
      fetchPosts(); // 投稿後に再取得
    } catch (err) {
      alert(`投稿に失敗しました: ${(err as Error).message}`);
    }
  };

  // 投稿削除処理
  const handleDelete = async (postId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`削除に失敗しました: ${response.status}`);
      }

      alert("投稿を削除しました！");
      fetchPosts(); // 削除後に再取得
    } catch (err) {
      alert(`削除に失敗しました: ${(err as Error).message}`);
    }
  };

   // お気に入り追加処理
const handleAddFavorite = async () => {
  if (!userID || !saunaID) {
    alert("ユーザー情報またはサウナ情報が不足しています。");
    return;
  }
  

  try {
    const response = await fetch("http://127.0.0.1:8000/favorites", {
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
      throw new Error("お気に入り追加に失敗しました: ${response.status}");
    }

    alert("お気に入りに追加しました！");
  } catch (err) {
    alert("お気に入り追加に失敗しました: ${(err as Error).message}");
  }
};

// お気に入り削除処理
const handleRemoveFavorite = async () => {
  if (!userID || !saunaID) {
    alert("ユーザー情報またはサウナ情報が不足しています。");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/favorites", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userID,
        sauna_id: saunaID,
      }),
    });

    if (!response.ok) {
      throw new Error("お気に入り削除に失敗しました: ${response.status}");
    }

    alert("お気に入りから削除しました！");
  } catch (err) {
    alert("お気に入り削除に失敗しました: ${(err as Error).message}");
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
          {/* 上段: サウナ詳細情報とGoogleマップ */}
          <Flex align="flex-start" gap={8}>
            {/* 左側: サウナの詳細情報 */}
            <Box flex="1">
              <Text fontSize="2xl" fontWeight="bold">
                {sauna.name}
              </Text>
              <Text>住所: {sauna.address}</Text>
              <Text>評価: {sauna.rating || "評価なし"}</Text>
              {/* お気に入りボタン */}
              <Button
    color="teal"
    onClick={handleAddFavorite}
    disabled={!userID || !saunaID}
  >
    お気に入りに追加
  </Button>
  <Button
    color="red"
    onClick={handleRemoveFavorite}
    disabled={!userID || !saunaID}
    ml={4}
  >
    お気に入りから削除
  </Button>
            </Box>

            {/* 右側: Googleマップ */}
            <Box
              ref={mapRef}
              height="300px"
              flex="1"
              borderWidth="1px"
              borderRadius="md"
              overflow="hidden"
            />
          </Flex>

          {/* 下段: 写真と投稿機能 */}
          <VStack align="stretch" mt={6}>
            {/* 写真 */}
            {sauna.photos && sauna.photos.length > 0 && (
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  サウナの写真
                </Text>
                <Flex flexWrap="wrap" gap={4}>
                  {sauna.photos.map((photo: any, index: number) => (
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

            {/* 投稿フォーム */}
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

            {/* 投稿一覧 */}
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

            {/* マイページに戻るボタン */}
            <Box display="flex" justifyContent="center" mt={10}>
              <Button
                mt={4}
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
