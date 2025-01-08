import { Session } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { sessionState } from "@/libs/states";
import supabase from "@/libs/supabase";

type SessionProviderProps = {
  children: React.ReactNode;
};

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [, setSession] = useRecoilState<Session | null>(sessionState);

  useEffect(() => {
    const sessionUpdate = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("セッション取得エラー:", error);
        setIsReady(false);
        return;
      }
      console.log("SessionProvider のセッション情報:", session); // セッション情報をログに出力
      setSession(session);
      if (session) {
        if (pathname === "/") {
          router.replace(`${process.env.NEXT_PUBLIC_BASE_URL}/mypage`); // ログイン済みの場合のリダイレクト
        }
        setIsReady(true);
        return;
      }
      if (pathname !== "/") {
        router.replace(`${process.env.NEXT_PUBLIC_BASE_URL}/`); // 未ログイン時はログインページにリダイレクト
      }
      setIsReady(true);
    };

    sessionUpdate();
  }, [router, pathname, setIsReady, setSession]);

  if (!isReady) {
    return null; // セッション準備ができるまで空のコンポーネントを表示
  }
  return <>{children}</>;
};
