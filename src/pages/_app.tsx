import { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { SessionProvider } from "@/providers/SessionProvider";
import { Provider } from "@/components/ui/provider";
import Script from "next/script";
import { UserProvider } from "@/components/contexts/UserContext";

export default function App({ Component, pageProps }: AppProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Google Maps API Key が見つかりません。環境変数を確認してください。");
  }

  return (
    <RecoilRoot>
      <SessionProvider>
        <Provider>
          <UserProvider>
            {/* Google Maps API スクリプトの読み込み */}
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDG0HEm5TAa2rp7I2qNp1_G41Qs3Fmej2Q&libraries=places`}
            strategy="lazyOnload"
          />
          <Component {...pageProps} />
          </UserProvider>
        </Provider>
      </SessionProvider>
    </RecoilRoot>
  );
}
