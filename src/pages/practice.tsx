import { Box, Grid, GridItem, Text, Button, VStack, Link, AbsoluteCenter, Heading, SimpleGrid, Image } from "@chakra-ui/react"
import { InputGroup } from "@/components/ui/input-group"
import { FaSearch } from "react-icons/fa"
import { keyframes } from "@emotion/react";
import axios from "axios";
import {useState, useEffect} from "react";
import { GrNewWindow } from "react-icons/gr";
import { LogoutButton } from "@/components/Buttons/LogOutButton";
import { useRouter } from "next/router";

export default function SaunaApp() {
  const slideShow = keyframes`
  0%, 25% { background-image: url('/Images/ROOFTOPサ室.jpg'); }
  26%, 50% { background-image: url('/Images/サウナ東京.jpg'); }
  51%, 75% { background-image: url('/Images/ととのい.jpg'); }
  76%, 100% { background-image: url('/Images/totonoi.jpg'); }
`;

//リンクを押して指定したボックスにスクロール
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

//ボタンを押すと指定したページに遷移
  const router = useRouter();
  
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
        <Link
          onClick={() => scrollTo("box1")}
          color="white"
          cursor="pointer"
          ml={10}
          mt={5}
        >
          "ととのう"とは？
        </Link>
        <Link
          onClick={() => scrollTo("box2")}
          color="white"
          cursor="pointer"
          ml={6}
          mt={3}
        >
          みんなのサ活
        </Link>
        <Link
          onClick={() => scrollTo("box3")}
          color="white"
          cursor="pointer"
          ml={6}
          mt={3}
        >
          myお気に入りサウナ
        </Link>
        </GridItem>
        <GridItem colSpan={2}></GridItem>
        <GridItem colSpan={1} textAlign="right" mr={5} mt={3}>
          <LogoutButton/>
        </GridItem>
      </Grid>
    </Box>

    <Box h="90%">
    <AbsoluteCenter>
      <VStack>
        <Text fontWeight="100" fontSize="xl" color="white" mt={10}>
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

  <Box
        h="100vh"
        id="box1"
        bgImage="url('/Images/image.jpg')" // 背景画像
        bgSize="cover"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        p={4}
      >
        <VStack>
          <Heading size="4xl" color="white" textShadow="0px 4px 8px rgba(0, 0, 0, 0.8)">
            "ととのう"とは
          </Heading>
          <Text fontSize="lg" color="gray.500" maxW="600px">
            サウナで心と体がリフレッシュし、最高のリラクゼーション状態に達する瞬間。それが「ととのう」体験です。
          </Text>
        </VStack>
  </Box>

  <Box py={20}>
        <Heading size="lg" mb={8} textAlign="center">
          サウナの基本サイクル
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} px={2} gap="5px" bg="#ffe0ff">
  <Box textAlign="center" bg="white" p={6} shadow="md" borderRadius="md">
    <Image
      src="/Images/温め.jpeg"
      alt="サウナで温める"
      mb={4}
      boxSize="150px" // 画像サイズを統一
      objectFit="cover" // 画像の比率を保ちながら枠に収める
      mx="auto" // 左右中央揃え
    />
    <Heading size="lg">1. 温める</Heading>
    <Text mt={2} fontSize="sm">サウナで体を温め、じっくり汗を流します。</Text>
  </Box>

  <Box textAlign="center" bg="white" p={6} shadow="md" borderRadius="md">
    <Image
      src="/Images/水風呂.jpg"
      alt="水風呂で冷やす"
      mb={4}
      boxSize="150px"
      objectFit="cover"
      mx="auto"
    />
    <Heading size="lg">2. 冷やす</Heading>
    <Text mt={2} fontSize="sm">水風呂に入って、体を一気に冷却します。</Text>
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
    <Heading size="lg">3. 休む</Heading>
    <Text mt={2} fontSize="sm">外気浴やリクライニングで体をリラックスさせます。</Text>
  </Box>
</SimpleGrid>
  </Box>

  <Box bg="blue.50" py={16}>
        <Heading size="lg" mb={6} textAlign="center">
          「ととのう」とは？
        </Heading>
        <VStack>
        <Text fontSize="lg" px={4} maxW="1000px" mx="auto" textAlign="center">
          サウナと水風呂、外気浴を繰り返すことで、"脳内麻薬"といわれるエンドルフィンやオキシトシン、セロトニンの3つの物質が脳内で分泌され、全身がリフレッシュされる感覚。
          頭がスーッと軽くなり、心も体も解放される瞬間です。
        </Text>
        <Text mt={10} fontSize="lg" px={4} maxW="1000px" mx="auto" textAlign="center">
        サウナ、水風呂、外気浴（休憩）の温冷交代浴の3ステップを最低１～3セット繰り返した後、外気浴（休憩）の際に、体がふわっと軽く感じ、頭がクリアですっきりとした感覚になり、一種の恍惚感を感じる状態のことを「ととのう」といいます。トランス状態と表現されることもあります。瞑想同様、雑念がなくなり思考がクリアになる、アイディアが生まれる、などの効果もあるとされています。
        </Text>
        </VStack>
      </Box>


  <Box id="box2" bg="green.100" p={8} minH="100vh">
    <Text fontSize="2xl" fontWeight="bold">
          みんなのサ活
    </Text>
      <Text>最新のサ活を表示</Text>
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

  <Box id="box3" bg="blue.100" p={8} minH="100vh">
    <Text fontSize="2xl" fontWeight="bold">
          myお気に入りサウナ
    </Text>
      <Text>ユーザーがお気に入りボタンを押したサウナをいくつか表示</Text>
  </Box>

  </>
)
}
