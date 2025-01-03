import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Spinner, Text, SimpleGrid } from "@chakra-ui/react";

const SaunaResult: React.FC = () => {
  const router = useRouter();
  const { keyword, prefecture } = router.query; // クエリパラメータを取得
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    console.log(`Received query params:`, { keyword, prefecture });

    const fetchResults = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const params = new URLSearchParams();
        if (keyword) params.append("keyword", keyword as string);
        if (prefecture) params.append("prefecture", prefecture as string);

        const url = `http://127.0.0.1:8000/saunas?${params.toString()}`;
        console.log(`Fetching results from URL: ${url}`);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        if (Array.isArray(data)) {
          setResults(data.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0)));
        } else {
          setErrorMessage(data.message || "予期しないエラーが発生しました。");
        }
      } catch (error) {
        console.error("検索に失敗しました:", error);
        setErrorMessage("サウナの情報を取得できませんでした。");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [keyword, prefecture, router.isReady]);

  const handleSaunaClick = (placeId: string) => {
    router.push(`/sauna/${placeId}`); // サウナ詳細ページへ遷移
  };

  return (
    <Box>
      <Box p={4} textAlign="center">
        <Text fontSize="2xl" fontWeight="bold">
          検索結果
        </Text>
      </Box>
      {loading ? (
        <Spinner size="xl" mt={4} />
      ) : errorMessage ? (
        <Text mt={4} textAlign="center" color="red.500">
          {errorMessage}
        </Text>
      ) : results.length > 0 ? (
        <SimpleGrid columns={1} p={4}>
          {results.map((sauna) => (
            <Box
              key={sauna.id}
              p={4}
              border="1px solid #ccc"
              borderRadius="md"
              cursor="pointer"
              onClick={() => handleSaunaClick(sauna.id)} // place_id を使用
              _hover={{ backgroundColor: "gray.100" }}
            >
              <Text fontWeight="bold">{sauna.name}</Text>
              <Text>住所: {sauna.address}</Text>
              <Text>評価: {sauna.rating || "評価なし"}</Text>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Text mt={4} textAlign="center" color="gray.500">
          検索結果が見つかりませんでした。
        </Text>
      )}
    </Box>
  );
};

export default SaunaResult;
