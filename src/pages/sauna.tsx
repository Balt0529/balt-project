import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  SimpleGrid,
  Input,
  Spinner,
  Heading,
} from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/router";

const SearchForm = () => {
  const [activeTab, setActiveTab] = useState("keyword"); // タブの状態
  const [isModalOpen, setModalOpen] = useState(false); // モーダル表示状態
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]); // 選択された都道府県
  const [keyword, setKeyword] = useState(""); // キーワード検索用
  const [loading, setLoading] = useState(false); // ローディング状態
  const router = useRouter();

  // 地域ごとの都道府県データ
  const regions = [
    {
      name: "北海道・東北",
      prefectures: ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
    },
    {
      name: "関東",
      prefectures: ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"],
    },
    {
      name: "北陸・甲信越",
      prefectures: ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県"],
    },
    {
      name: "東海",
      prefectures: ["岐阜県", "静岡県", "愛知県", "三重県"],
    },
    {
      name: "近畿",
      prefectures: ["滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
    },
    {
      name: "中国・四国",
      prefectures: ["鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県"],
    },
    {
      name: "九州・沖縄",
      prefectures: ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"],
    },
  ];

  // チェックボックス変更処理
  const handleCheckboxChange = (prefecture: string) => {
    setSelectedAreas((prev) =>
      prev.includes(prefecture)
        ? prev.filter((area) => area !== prefecture)
        : [...prev, prefecture]
    );
  };

  // 検索処理
  const handleSearch = async () => {
    setLoading(true); // ローディング開始
    try {
      const queryParams: Record<string, string> = {};

      // タブがキーワード検索の場合
      if (activeTab === "keyword" && keyword.trim() !== "") {
        queryParams.keyword = keyword; // キーワードを追加
      }
      // タブが都道府県検索の場合
      else if (activeTab === "area" && selectedAreas.length > 0) {
        queryParams.prefecture = selectedAreas.join(","); // カンマ区切りで都道府県を追加
      }

      // クエリパラメータが空の場合は検索を行わない
      if (Object.keys(queryParams).length === 0) {
        console.error("検索条件が指定されていません。");
        setLoading(false);
        return;
      }

      console.log("Generated Query String: ${queryString}"); // 確認用ログ
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 模擬的な遅延
      router.push("/saunaresult?${queryString}");
    } catch (error) {
      console.error("検索に失敗しました:", error);
    } finally {
      setLoading(false); // ローディング終了
    }
  };

  return (
    <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh" // 画面全体の高さを確保
    bgImage="url('/Images/monstersauna.webp')" // 背景画像を設定
    bgSize="cover" // 画像を全体に広げる
    bgRepeat="no-repeat" // 背景画像を繰り返さない
  >
  <Box
    p={16}
    bg="rgba(255, 255, 255, 0.6)" // 半透明の白
    boxShadow="lg"
    borderRadius="lg"
    width="90%"
    maxWidth="800px"
    minWidth="400px"
    mx="auto"
  >
      {/* ローディング表示 */}
      {loading && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex="1000"
        >
          <Spinner size="xl" color="white" />
          <Text color="white" mt={4}>
            検索中です。少々お待ちください...
          </Text>
        </Box>
      )}
      {/* タイトル追加 */}
      <Heading as="h2" size="5xl" mb={6} textAlign="center" color="black">
          サウナ検索
        </Heading>

      {/* タブ切り替え */}
      <Box display="flex" mb={4}>
        <Button
          flex="1"
          bg="blue"
          border="2px solid white"
          colorScheme={activeTab === "keyword" ? "blue" : "gray"}
          onClick={() => setActiveTab("keyword")}
          _hover={{ bg: 'white' , color: 'blue', border: "2px solid blue"}} // ホバー時の背景色
          mr={2}
        >
          キーワードから探す
        </Button>
        <Button
          flex="1"
          bg="blue"
          border="2px solid white"
          colorScheme={activeTab === "area" ? "blue" : "gray"}
          onClick={() => setActiveTab("area")}
          _hover={{ bg: 'white' , color: 'blue', border: "2px solid blue" }}
        >
          都道府県から探す
        </Button>
      </Box>

      {/* タブの内容 */}
      {activeTab === "keyword" && (
        <Box>
          <Input
            placeholder="施設名・エリア・キーワード"
            border="1px solid black"
            size="md"
            mb={2}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            _hover={{ bg: 'gray.200' }} // ホバー時の背景色
          />
          <Button color="white" bg="red" width="100%" _hover={{ bg: 'white' , color: 'red', border: "2px solid red" }} onClick={handleSearch}>
            検 索
          </Button>
        </Box>
      )}

      {activeTab === "area" && (
        <Box>
          <Button bg="blue" color="white" width="100%" border="2px solid white" _hover={{ bg: 'white' , color: 'blue', border: "2px solid blue" }} onClick={() => setModalOpen(true)}>
            エリアを選択する
          </Button>
          {selectedAreas.length > 0 && (
            <Box mt={4} fontWeight="bold">
              選択されたエリア: {selectedAreas.join(", ")}
            </Box>
          )}
          <Button mt={4} bg="red" color="white" _hover={{ bg: 'white' , color: 'red', border: "2px solid red" }} width="100%" onClick={handleSearch}>
            検 索
          </Button>
        </Box>
      )}
      
      {/* モーダル風UI */}
{isModalOpen && (
  <Box
    position="fixed"
    top="0"
    left="0"
    width="100vw"
    height="100vh"
    bg="rgba(0, 0, 0, 0.5)" // 背景の半透明
    display="flex"
    justifyContent="center"
    alignItems="center"
    zIndex="1000"
  >
    <Box
      bg="white"
      p={6}
      borderRadius="md"
      width="95%"
      maxWidth="800px"
      maxHeight="80vh"
      overflowY="auto"
      boxShadow="lg" // 影を追加して立体感を出す
      position="relative" // 相対位置で要素を制御
    >
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        エリア絞り込み
      </Text>
      {regions.map((region) => (
        <Box key={region.name} mb={4}>
          <Text fontWeight="bold" mb={2}>
            {region.name}
          </Text>
          <SimpleGrid columns={6}>
            {region.prefectures.map((prefecture) => (
              <Checkbox
                key={prefecture}
                checked={selectedAreas.includes(prefecture)}
                onChange={() => handleCheckboxChange(prefecture)}
              >
                {prefecture}
              </Checkbox>
            ))}
          </SimpleGrid>
        </Box>
      ))}
      <Button
        mt={4}
        bg="blue"
        _hover={{ bg: "white", color: "blue", border: "2px solid blue" }}
        width="100%"
        onClick={() => setModalOpen(false)}
      >
        このエリアで絞り込む
      </Button>
    </Box>
  </Box>
)}

    </Box>
    </Box>
  );
};

export default SearchForm;