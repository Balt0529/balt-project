import { Heading } from "@chakra-ui/react";
import { Session } from "@supabase/supabase-js";
import { useRecoilState } from "recoil";
import { sessionState } from "@/libs/states";

export function HelloUserMessage() {
  const [session] = useRecoilState<Session | null>(sessionState);

  const avatarUrl =
    session?.user.user_metadata["picture"] ||
    session?.user.user_metadata["avatar_url"];

  return (
    <>
      <img
        src={avatarUrl}
        alt="User Avatar"
        style={{
          borderRadius: "50%",
          width: "64px",
          height: "64px",
          objectFit: "cover",
        }}
      />
      <Heading fontSize="6xl">
        Hello {session?.user.user_metadata["name"]} !!
      </Heading>
    </>
  );
}
