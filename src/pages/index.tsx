import { Inter } from "next/font/google";
import { Button, VStack, Heading, Text, Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import supabase from "@/libs/supabase";
import { Session,User } from "@supabase/supabase-js";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Auth() {
  const [sessionInfo, setSessionInfo] = useState<Session | null>(null);

  const text = 'お気に入りのサウナを探しに行きましょう！'; // 表示したい文字列
    const [displayedText, setDisplayedText] = useState(''); // 表示される文字列
    const [index, setIndex] = useState(0); // 現在の文字インデックス
  
    useEffect(() => {
      // インデックスが文字列の長さを超えたら処理を終了
      if (index >= text.length) return;
  
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]); // 次の文字を追加
        setIndex((prevIndex) => prevIndex + 1); // インデックスを更新
      }, 100); // 表示間隔 (ミリ秒)
  
      return () => clearTimeout(timeout); // 前回のタイマーをクリア
    }, [index, text]);

  // ログイン
  const GoogleSignIn = async () => {
    try {
      // Google認証プロセスを開始
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
  
      // セッション情報を取得
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
  
      const session = sessionData?.session;
  
      if (session?.user) {
        const user: User = session.user;
        const { error: dbError } = await supabase.from("users").upsert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || "匿名ユーザー",
        });
  
        if (dbError) throw dbError;
  
        setSessionInfo(session); // セッション情報を保存
      } else {
        console.error("セッション情報が取得できませんでした");
      }
    } catch (error) {
      console.error("ログインエラー:", error);
    }
  };
  

  // ログアウト処理
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSessionInfo(null); // セッション情報をクリア
    } catch (err) {
      console.error("ログアウトエラー:", err);
    }
  };
  

  return (
    <>
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDG0HEm5TAa2rp7I2qNp1_G41Qs3Fmej2Q&libraries=places`}
          async
          defer
        ></script>
      </Head>
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg="gray.600"
      color="white"
    >
    <VStack
      align="center"
      justify="center"
      height="100vh"
      className={inter.className}
    >
      <Text fontSize="3xl" fontWeight="bold">
        {displayedText}
      </Text>
      {sessionInfo ? (
        <>
          <Text>ログイン済み: {sessionInfo.user.email}</Text>
          <Button colorScheme="red" onClick={signOut}>
            ログアウト
          </Button>
        </>
      ) : (
        <Button color="black" bg="teal.200" _hover={{ bg: "red.200" }} size="xl"  onClick={GoogleSignIn}>
          Googleでログイン
        </Button>
      )}
    </VStack>
    </Box>
    </>
  );
}
