import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  SimpleGrid,
  Text,
  AbsoluteCenter,
  Spinner,
} from "@chakra-ui/react"; // Chakra UI v3.0.0対応
import { Checkbox } from "@/components/ui/checkbox";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";

const SearchForm = () => {
  const [activeTab, setActiveTab] = useState("keyword"); // タブの状態
  const [isModalOpen, setModalOpen] = useState(false); // モーダル表示状態
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]); // 選択された都道府県
  const [keyword, setKeyword] = useState(""); // キーワード検索用
  const [loading, setLoading] = useState(false); // ローディング状態
  const router = useRouter();

  // 都道府県一覧
  const prefectures = [
    "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
    "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
    "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
    "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
    "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
    "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
    "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
  ];

  // チェックボックスの変更処理
  const handleCheckboxChange = (prefecture: string) => {
    setSelectedAreas((prev) =>
      prev.includes(prefecture)
        ? prev.filter((area) => area !== prefecture)
        : [...prev, prefecture]
    );
  };

  // 検索処理
  const handleSearch = async () => {
    setLoading(true);
    try {
      const queryParams: Record<string, string> = {};
  
      if (activeTab === "keyword" && keyword) {
        queryParams.keyword = keyword;
      } else if (activeTab === "area" && selectedAreas.length > 0) {
        queryParams.prefecture = selectedAreas.join(","); // カンマ区切りで結合
      }
  
      const queryString = new URLSearchParams(queryParams).toString();
      router.push(`/sauna-map?${queryString}`);
    } catch (error) {
      console.error("検索に失敗しました:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <Box p={4} bg="white" boxShadow="md" borderRadius="md" width="100%" maxWidth="600px" mx="auto">
      {/* タブ切り替え */}
      <Box display="flex" mb={4}>
        <Button
          flex="1"
          colorScheme={activeTab === "keyword" ? "blue" : "gray"}
          onClick={() => setActiveTab("keyword")}
        >
          キーワードから探す
        </Button>
        <Button
          flex="1"
          colorScheme={activeTab === "area" ? "blue" : "gray"}
          onClick={() => setActiveTab("area")}
        >
          都道府県から探す
        </Button>
      </Box>

      {/* タブの内容 */}
      {activeTab === "keyword" && (
        <Box>
          <Input
            placeholder="施設名・エリア・キーワード"
            size="md"
            mb={2}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button colorScheme="red" width="100%" onClick={handleSearch}>
            検 索
          </Button>
        </Box>
      )}

      {activeTab === "area" && (
        <Box>
          <Button colorScheme="blue" width="100%" onClick={() => setModalOpen(true)}>
            エリアを選択する
          </Button>
          {selectedAreas.length > 0 && (
            <Box mt={4} fontWeight="bold">
              選択されたエリア: {selectedAreas.join(", ")}
            </Box>
          )}
          <Button mt={4} colorScheme="red" width="100%" onClick={handleSearch}>
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
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex="1000"
        >
          <Box bg="white" p={6} borderRadius="md" width="90%" maxWidth="500px">
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              エリア絞り込み
            </Text>
            <SimpleGrid columns={3}>
              {prefectures.map((prefecture) => (
                <Checkbox
                  key={prefecture}
                  checked={selectedAreas.includes(prefecture)}
                  onChange={() => handleCheckboxChange(prefecture)}
                >
                  {prefecture}
                </Checkbox>
              ))}
            </SimpleGrid>
            <Button mt={4} colorScheme="blue" width="100%" onClick={() => setModalOpen(false)}>
              このエリアで絞り込む
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SearchForm;
