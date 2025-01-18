import { Box, Grid, GridItem, Text, Button, VStack, Link, AbsoluteCenter, Heading, SimpleGrid, Image, Spinner } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState, useEffect } from "react";
import { LogoutButton } from "@/components/Buttons/LogOutButton";
import { useRouter } from "next/router";
import supabase from "@/libs/supabase";
import { User } from "@supabase/supabase-js";

// 型定義
type Post = {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: string;
    name: string;
  };
  sauna: {
    id: string;
    name: string;
  };
};

type Favorite = {
  id: number; // お気に入りのID
  sauna_id: string; // サウナID
};

type Sauna = {
  id: string; // サウナID
  name: string; // サウナ名
};

export default function SaunaApp() {
  const slideShow = keyframes`
    0%, 25% { background-image: url('/Images/ROOFTOPサ室.jpg'); }
    26%, 50% { background-image: url('/Images/サウナ東京.jpg'); }
    51%, 75% { background-image: url('/Images/ととのい.jpg'); }
    76%, 100% { background-image: url('/Images/totonoi.jpg'); }
  `;

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; user_metadata?: { full_name?: string } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [saunaNames, setSaunaNames] = useState<{ [key: string]: string }>({});
  const [showAll, setShowAll] = useState(false); // 全ての投稿を表示するかどうか
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        if (!response.ok) {
          throw new Error("投稿データの取得に失敗しました");
        }
        const data: Post[] = await response.json();

        // 投稿を作成日時の降順で並び替え
        const sortedPosts = data.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error("エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 表示する投稿を制御
  const displayedPosts = showAll ? posts : posts.slice(0, 5); // 最近5件のみ表示


  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return; // ユーザーがロードされていない場合はスキップ
  
      try {
        const response = await fetch(`${API_BASE_URL}/favorites?user_id=${user.id}`);
        if (!response.ok) {
          throw new Error("お気に入りデータの取得に失敗しました");
        }
        const data = await response.json();
        setFavorites(data.favorites); // ログイン中のユーザーのお気に入りのみ設定
      } catch (error) {
        console.error("お気に入り取得エラー:", error);
      }
    };
  
    fetchFavorites();
  }, [user, API_BASE_URL]); // userが更新された場合のみ再実行

  useEffect(() => {
    const fetchSaunaNames = async () => {
      try {
        const saunaNameMap: { [key: string]: string } = {};
        for (const favorite of favorites) {
          if (!saunaNameMap[favorite.sauna_id]) {
            const response = await fetch(
              `${API_BASE_URL}/saunas/${favorite.sauna_id}`
            );
            if (response.ok) {
              const data: Sauna = await response.json();
              saunaNameMap[favorite.sauna_id] = data.name;
            }
          }
        }
        setSaunaNames(saunaNameMap);
      } catch (error) {
        console.error("サウナ名取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    if (favorites.length > 0) {
      fetchSaunaNames();
    }
  }, [favorites]);


  // ユーザー情報をバックエンドに同期
  const syncUserWithBackend = async (user: { id: string; email: string; user_metadata?: { full_name?: string } }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || "匿名ユーザー",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("バックエンドエラー:", errorData);
        throw new Error("ユーザー作成または更新に失敗しました");
      }
      console.log("バックエンドにユーザー情報を同期しました");
    } catch (error) {
      console.error("バックエンド同期エラー:", error);
    }
  };

  // ユーザー情報を取得し、バックエンドに同期
  useEffect(() => {
    const fetchAndSyncUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("セッション取得エラー:", error);
          router.push("/"); // 未ログインの場合はログインページへ
          return;
        }
  
        const session = data?.session;
        if (session?.user) {
          const user = session.user as User;
  
          // email が undefined の場合のフォールバックを設定
          if (!user.email) {
            throw new Error("ユーザーの email が見つかりません");
          }
  
          setUser({
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata,
          });
  
          await syncUserWithBackend({
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata,
          }); // バックエンドに同期
        } else {
          router.push("/"); // セッションがない場合はログインページへ
        }
      } catch (error) {
        console.error("データ取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAndSyncUser();
  }, [router]);


  const handleDeleteFavorite = async (favoriteId: number) => {
    if (!user) return; // ログインしていない場合は中断
  
    try {
      const response = await fetch(
        `${API_BASE_URL}/favorites/${favoriteId}?user_id=${user.id}`, // クエリにuser_idを追加
        {
          method: "DELETE",
        }
      );
  
      if (!response.ok) {
        throw new Error(`お気に入り削除に失敗しました: ${response.status}`);
      }
  
      setFavorites((prev) => prev.filter((favorite) => favorite.id !== favoriteId)); // フロントエンドの状態を更新
      alert("お気に入りを削除しました！");
    } catch (error) {
      console.error("お気に入り削除エラー:", error);
      alert("お気に入りの削除に失敗しました。");
    }
  };


  if (loading) {
    return (
      <Box textAlign="center" mt="10">
        <Spinner size="xl" />
        <Text mt={4}>データを読み込んでいます...</Text>
      </Box>
    );
  }

  return (
    <>
      <Box
        h={"90vh"}
        bgSize="cover"
        animation={`${slideShow} 12s infinite`}
        bgBlendMode="overlay"
        bgColor="blue.700"
        position="relative"
      >
        <Box h={"10%"}>
          <Grid templateColumns="repeat(5, 1fr)">
            <GridItem colSpan={2}>
              <Link onClick={() => scrollTo("box1")} color="white" cursor="pointer" ml={10} mt={5}>
                &quot;ととのう&quot;とは？
              </Link>
              <Link onClick={() => scrollTo("box2")} color="white" cursor="pointer" ml={6} mt={3}>
                みんなのサ活
              </Link>
              <Link onClick={() => scrollTo("box3")} color="white" cursor="pointer" ml={6} mt={3}>
                myお気に入りサウナ
              </Link>
            </GridItem>
            <GridItem colSpan={2}>
            </GridItem>
            <GridItem colSpan={1} textAlign="right" mr={5} mt={3}>
              <LogoutButton />
            </GridItem>
          </Grid>
        </Box>

        <Box h="90%">
          <AbsoluteCenter>
          <VStack>
            {user ? (
              <Text fontSize="xl" color="white">
                ようこそ！{user.user_metadata?.full_name || "匿名ユーザー"} さん！
              </Text>
            ) : (
              <Text fontSize="xl" color="white">
                ログインしていません
              </Text>
            )}
              <Text fontWeight="100" fontSize="xl" color="white" mt={12}>
                お気に入りのサウナ検索・サ活投稿ができるサイト
              </Text>
              <Text fontWeight="1000" fontSize="7xl" color="white" textShadow="3px 3px 10px white" mt={3}>
                サウナツアーズ
              </Text>
              <Button
                mt={20}
                onClick={() => router.push("/sauna")}
                fontSize="md"
                color="black"
                bg="yellow.200"
                h="50px"
                w="300px"
                _hover={{ bg: "gray.200" }}
              >
                サウナを検索
              </Button>
            </VStack>
          </AbsoluteCenter>
        </Box>
      </Box>

      <Box h="100vh" id="box1" bgImage="url('/Images/image.jpg')" bgSize="cover" display="flex" alignItems="center" justifyContent="center" textAlign="center" p={4}>
      <VStack>
          <Heading size="4xl" color="white" textShadow="0px 4px 8px rgba(14, 6, 6, 0.8)">
            &quot;ととのう&quot;とは
          </Heading>
          <Text fontSize="lg" color="black" maxW="650px">
            サウナで心と体がリフレッシュし、最高のリラクゼーション状態に達する瞬間。それが「ととのう」体験です。
          </Text>
        </VStack>
      </Box>

      {/* サウナの基本サイクル */}
      <Box py={16}>
        <Heading size="3xl" mb={8} textAlign="center">
          サウナの基本サイクル
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} px={4} bg="pink.50">
  <Box textAlign="center" bg="white" p={6} shadow="md" borderRadius="md" mr={4}>
    <Image
      src="/Images/温め.jpeg"
      alt="サウナで温める"
      mb={4}
      boxSize="150px" // 画像サイズを統一
      objectFit="cover" // 画像の比率を保ちながら枠に収める
      mx="auto" // 左右中央揃え
    />
    <Heading size="xl">1. 温める</Heading>
    <Text mt={2}>サウナで体を温め、じっくり汗を流します。</Text>
  </Box>

  <Box textAlign="center" bg="white" p={6} shadow="md" borderRadius="md" mr={4}>
    <Image
      src="/Images/水風呂.jpg"
      alt="水風呂で冷やす"
      mb={4}
      boxSize="150px"
      objectFit="cover"
      mx="auto"
    />
    <Heading size="xl">2. 冷やす</Heading>
    <Text mt={2}>水風呂に入って、体を一気に冷却します。</Text>
  </Box>

  <Box textAlign="center" bg="white" p={6} shadow="md" borderRadius="md">
    <Image
      src="/Images/外気浴.png"
      alt="休憩する"
      mb={4}
      boxSize="150px"
      objectFit="cover"
      mx="auto"
    />
    <Heading size="xl">3. 休む</Heading>
    <Text mt={2}>外気浴やリクライニングで体をリラックスさせます。</Text>
  </Box>
</SimpleGrid>
      </Box>

      {/* ととのいの感覚 */}
      <Box bg="blue.50" py={16}>
        <Heading size="2xl" mb={6} textAlign="center">
          「ととのう」とは？
        </Heading>
        <Text fontSize="lg" px={4} maxW="800px" mx="auto" textAlign="center">
          サウナと水風呂、外気浴を繰り返すことで、エンドルフィンやセロトニン、オキシトシンなどの&quot;脳内麻薬&quot;が分泌され、全身がリフレッシュされる感覚。
          頭がスーッと軽くなり、心も体も解放される瞬間です。
        </Text>
      </Box>

      <Box id="box2" bg="green.100" p={8} minH="100vh">
      <Heading size="lg" mb={6}>
        みんなのサ活
      </Heading>
      {posts.length > 0 ? (
        <>
          {displayedPosts.map((post) => (
            <Box key={post.id} p={4} mb={4} borderWidth="1px" borderRadius="md">
              <Text fontWeight="bold">{post.user.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {post.sauna.name} - {new Date(post.created_at).toLocaleString()}
              </Text>
              <Text mt={2}>{post.content}</Text>
            </Box>
          ))}

          {/* "さらに表示" ボタン */}
          {!showAll && posts.length > 5 && (
            <Button
              mt={4}
              colorScheme="teal"
              onClick={() => setShowAll(true)}
            >
              さらに表示
            </Button>
          )}

          {/* "表示を減らす" ボタン */}
          {showAll && (
            <Button
              mt={4}
              colorScheme="red"
              onClick={() => setShowAll(false)}
            >
              表示を減らす
            </Button>
          )}
        </>
      ) : (
        <Text>まだ投稿がありません。</Text>
      )}
</Box>


<Box id="box3" bg="blue.100" p={8} minH="100vh">
  <Heading size="lg" mb={6}>
    myお気に入りサウナ
  </Heading>
  {favorites.length > 0 ? (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }}>
      {favorites.map((favorite) => (
        <Box
          key={favorite.id}
          p={6}
          bg="white"
          shadow="md"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            {saunaNames[favorite.sauna_id] || "読み込み中..."}
          </Text>
          <Text color="gray.600">ID: {favorite.sauna_id}</Text>
          <Button
            mt={4}
            colorScheme="red"
            size="sm"
            onClick={() => handleDeleteFavorite(favorite.id)}
          >
            削除
          </Button>
        </Box>
      ))}
    </SimpleGrid>
  ) : (
    <Text textAlign="center" fontSize="lg" color="white">
      まだお気に入りがありません。
    </Text>
  )}
</Box>

    </>
  );
}
