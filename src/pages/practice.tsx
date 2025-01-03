import { Box, Grid, GridItem, Text, Button, VStack, Link, AbsoluteCenter, Heading, SimpleGrid, Image, Spinner } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState, useEffect } from "react";
import { LogoutButton } from "@/components/Buttons/LogOutButton";
import { useRouter } from "next/router";
import supabase from "@/libs/supabase";

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

  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("セッション取得エラー:", error);
          return;
        }

        const session = data?.session;
        if (session?.user) {
          setUser(session.user);

          const { data: favoriteData, error: favoriteError } = await supabase
            .from("favorites")
            .select("sauna_id, sauna(name, address)")
            .eq("user_id", session.user.id);

          if (favoriteError) {
            console.error("お気に入りデータ取得エラー:", favoriteError);
          } else {
            setFavorites(favoriteData || []);
          }
        }
      } catch (error) {
        console.error("データ取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndFavorites();
  }, []);

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
        animation={`${slideShow} 20s infinite`}
        bgBlendMode="overlay"
        bgColor="blue.700"
        position="relative"
      >
        <Box h={"10%"}>
          <Grid templateColumns="repeat(5, 1fr)">
            <GridItem colSpan={2}>
              <Link onClick={() => scrollTo("box1")} color="white" cursor="pointer" ml={10} mt={5}>
                "ととのう"とは？
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
            <Text fontSize="xl" color="white">
              ようこそ！{user.user_metadata?.full_name || "匿名ユーザー"} さん！
            </Text>
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
          <Heading size="4xl" color="white" textShadow="0px 4px 8px rgba(0, 0, 0, 0.8)">
            "ととのう"とは
          </Heading>
          <Text fontSize="lg" color="gray.500" maxW="600px">
            サウナで心と体がリフレッシュし、最高のリラクゼーション状態に達する瞬間。それが「ととのう」体験です。
          </Text>
        </VStack>
      </Box>

      <Box id="box2" bg="green.100" p={8} minH="100vh">
        <Heading size="lg" mb={4}>
          みんなのサ活
        </Heading>
        <Text>最新のサ活を表示</Text>
      </Box>

      <Box id="box3" bg="blue.100" p={8} minH="100vh">
        <Heading size="lg" mb={4}>
          myお気に入りサウナ
        </Heading>
        {user ? (
          <>
            {favorites.length > 0 ? (
              <VStack align="stretch">
                {favorites.map((favorite) => (
                  <Box key={favorite.sauna_id} p={4} border="1px solid #ddd" borderRadius="md" bg="gray.50">
                    <Text fontSize="lg" fontWeight="bold">{favorite.sauna.name}</Text>
                    <Text>{favorite.sauna.address}</Text>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text>お気に入りのサウナがまだ登録されていません。</Text>
            )}
          </>
        ) : (
          <Text>ログインが必要です。</Text>
        )}
      </Box>
    </>
  );
}
