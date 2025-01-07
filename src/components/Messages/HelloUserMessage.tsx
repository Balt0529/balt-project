import { Heading } from "@chakra-ui/react";
import { Session } from "@supabase/supabase-js";
import { useRecoilState } from "recoil";
import { sessionState } from "@/libs/states";
import Image from "next/image";

export function HelloUserMessage() {
  const [session] = useRecoilState<Session | null>(sessionState);

  const avatarUrl =
    session?.user.user_metadata["picture"] ||
    session?.user.user_metadata["avatar_url"];

  return (
    <>
      {avatarUrl && (
        <Image
          src={avatarUrl}
          alt="User Avatar"
          width={64}
          height={64}
          style={{
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      )}
      <Heading fontSize="6xl">
        Hello {session?.user.user_metadata["name"]} !!
      </Heading>
    </>
  );
}
