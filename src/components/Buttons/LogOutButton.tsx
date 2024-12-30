import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import supabase from "@/libs/supabase";

export function LogoutButton() {
  const router = useRouter();
  return (
    <Button
      bg="red.400"
      color="white"
      _hover={{ bg: "gray.200" }}
      onClick={() => {
        supabase.auth.signOut();
        router.push("/");
      }}
    >
      ログアウト
    </Button>
  );
}
