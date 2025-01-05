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
//   {sauna ? (
//     <>
//       <Text fontSize="2xl" fontWeight="bold">{sauna.name}</Text>
//       <Text>住所: {sauna.address}</Text>
//       <Text>評価: {sauna.rating || "評価なし"}</Text>
//       {sauna.photos && sauna.photos.length > 0 ? (
//         <Box display="flex" flexWrap="wrap" gap={4} mt={4}>
//           {sauna.photos.map((photo: any, index: number) => (
//             <Image
//               key={index}
//               src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${googleMapsApiKey}`}
//               alt={`${sauna.name}の写真${index + 1}`}
//               borderRadius="md"
//               width="200px"
//               height="150px"
//               objectFit="cover"
//             />
//           ))}
//         </Box>
//       ) : (
//         <Text mt={4}>画像がありません。</Text>
//       )}
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
  Textarea,
  Button,
  Toast,
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
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

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

   // Toastメッセージを代替
   const showToast = (title: string, description?: string, status?: string) => {
    alert(`${title}: ${description || ""}`);
  };

  const handlePost = async () => {
    if (!content.trim()) {
      showToast("投稿内容が空です", "入力してください", "warning");
      return;
    }

    try {
      // 投稿処理
      const response = await fetch("http://127.0.0.1:8000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "example_user_id",
          sauna_id: saunaID,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error(`投稿に失敗しました: ${response.status}`);
      }

      showToast("投稿成功", "投稿が完了しました", "success");
      setContent("");
    } catch (err) {
      showToast("投稿失敗", (err as Error).message, "error");
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
          <Text fontSize="2xl" fontWeight="bold">
            {sauna.name}
          </Text>
          <Text>住所: {sauna.address}</Text>
          <Text>評価: {sauna.rating || "評価なし"}</Text>
          {sauna.photos && sauna.photos.length > 0 ? (
            <Box display="flex" flexWrap="wrap" gap={4} mt={4}>
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
            </Box>
          ) : (
            <Text mt={4}>画像がありません。</Text>
          )}

          {/* 投稿フォーム */}
          <Box mt={6}>
            <Text fontSize="lg" fontWeight="bold">
              投稿フォーム
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
              onClick={handlePost}
              disabled={!userID || !saunaID}
            >
              投稿する
            </Button>
          </Box>
        </>
      ) : (
        <Text>サウナの情報が見つかりません。</Text>
      )}
    </Box>
  );
};

export default SaunaDetail;
