import { Inter } from "next/font/google";
import { Button, VStack, Text, Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import supabase from "@/libs/supabase";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Auth() {
  const router = useRouter();
  const text = "お気に入りのサウナを探しに行きましょう！";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= text.length) return;
    const timeout = setTimeout(() => {
      setDisplayedText((prev) => prev + text[index]);
      setIndex((prevIndex) => prevIndex + 1);
    }, 100);
    return () => clearTimeout(timeout);
  }, [index, text]);

  // Googleログイン処理
  const GoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) {
        console.error("Googleログインエラー:", error);
        return;
      }

      // リダイレクト
      router.push("/mypage"); // ログイン後のページ
    } catch (error) {
      console.error("ログイン処理エラー:", error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg="gray.600"
      color="white"
    >
      <VStack align="center" justify="center" height="100vh" className={inter.className}>
        <Text fontSize="3xl" fontWeight="bold">
          {displayedText}
        </Text>
        <Button
          color="black"
          bg="teal.200"
          _hover={{ bg: "red.200" }}
          size="xl"
          onClick={GoogleSignIn}
        >
          Googleでログイン
        </Button>
      </VStack>
    </Box>
  );
}
