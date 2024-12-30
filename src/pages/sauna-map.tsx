// import { useEffect, useState } from "react";

// const SaunaMap: React.FC = () => {
//   const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
//   const [map, setMap] = useState<google.maps.Map | null>(null);
//   const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   // Google Maps API スクリプトのロード状況を監視
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       if (window.google && window.google.maps) {
//         setIsGoogleLoaded(true);
//         clearInterval(intervalId);
//       }
//     }, 100);

//     return () => clearInterval(intervalId);
//   }, []);

//   // 地図の初期化
//   useEffect(() => {
//     if (isGoogleLoaded) {
//       const mapInstance = new google.maps.Map(
//         document.getElementById("map") as HTMLElement,
//         {
//           center: { lat: 35.6895, lng: 139.6917 }, // デフォルトを東京に設定
//           zoom: 8,
//         }
//       );
//       setMap(mapInstance);
//     }
//   }, [isGoogleLoaded]);

//   // マーカーをクリアする
//   const clearMarkers = () => {
//     markers.forEach((marker) => marker.setMap(null));
//     setMarkers([]);
//   };

//   // サウナ検索処理
//   const searchSaunas = (query: string, location: google.maps.LatLngLiteral) => {
//     if (!map) return;

//     clearMarkers();
//     setErrorMessage(null);

//     const service = new google.maps.places.PlacesService(map);
//     const request = {
//       query,
//       location,
//       radius: 50000, // 半径50km
//     };

//     service.textSearch(request, (results, status) => {
//       if (status === google.maps.places.PlacesServiceStatus.OK && results) {
//         const newMarkers = results
//           .map((place) => {
//             if (place.geometry && place.geometry.location) {
//               return new google.maps.Marker({
//                 position: place.geometry.location,
//                 map,
//                 title: place.name,
//               });
//             }
//             return null;
//           })
//           .filter((marker): marker is google.maps.Marker => marker !== null);

//         setMarkers(newMarkers);
//       } else {
//         const error = `検索に失敗しました: ${status}`;
//         setErrorMessage(error);
//         console.error(error);
//       }
//     });
//   };

//   // 都道府県の中心座標を取得して検索
//   const handlePrefectureSearch = (prefecture: string) => {
//     if (!map) return;

//     const geocoder = new google.maps.Geocoder();
//     geocoder.geocode({ address: prefecture }, (results, status) => {
//       if (
//         status === google.maps.GeocoderStatus.OK &&
//         results &&
//         results[0].geometry &&
//         results[0].geometry.location
//       ) {
//         const location = results[0].geometry.location.toJSON();
//         map.setCenter(location);
//         map.setZoom(10); // 都道府県レベルのズーム
//         searchSaunas(`${prefecture} サウナ`, location);
//       } else {
//         const error = `都道府県の座標取得に失敗しました: ${status}`;
//         setErrorMessage(error);
//         console.error(error);
//       }
//     });
//   };

//   // 検索フォームの送信処理
//   const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const form = e.currentTarget;
//     const keywordInput = form.elements.namedItem("keyword") as HTMLInputElement;
//     const prefectureSelect = form.elements.namedItem("prefecture") as HTMLSelectElement;

//     const keyword = keywordInput?.value.trim();
//     const prefecture = prefectureSelect?.value;

//     if (prefecture) {
//       handlePrefectureSearch(prefecture);
//     } else if (keyword) {
//       if (!map) return;
//       const location = map.getCenter()?.toJSON() || { lat: 35.6895, lng: 139.6917 }; // 現在の地図の中心
//       searchSaunas(`${keyword} サウナ`, location);
//     } else {
//       setErrorMessage("検索条件を入力してください。");
//     }
//   };

//   return (
//     <div>
//       {/* 検索フォーム */}
//       <form onSubmit={handleSearchSubmit} style={{ margin: "10px" }}>
//         <input
//           type="text"
//           name="keyword"
//           placeholder="キーワードで検索 (例: サウナ)"
//           style={{ marginRight: "10px" }}
//         />
//         <select name="prefecture" style={{ marginRight: "10px" }}>
//           <option value="">都道府県を選択</option>
//           <option value="東京都">東京都</option>
//           <option value="大阪府">大阪府</option>
//           <option value="北海道">北海道</option>
//           {/* 他の都道府県も追加 */}
//         </select>
//         <button type="submit">検索</button>
//       </form>

//       {/* エラーメッセージ表示 */}
//       {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

//       {/* 地図表示エリア */}
//       <div id="map" style={{ width: "100%", height: "90vh" }} />
//     </div>
//   );
// };

// export default SaunaMap;

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Spinner, Text, SimpleGrid } from "@chakra-ui/react";

const SaunaMap: React.FC = () => {
  const router = useRouter();
  const { keyword, areas } = router.query; // クエリパラメータを取得
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // クエリパラメータを作成
        const params = new URLSearchParams();
        if (keyword) params.append("keyword", keyword as string);
        if (areas) params.append("prefecture", areas as string);

        // GETリクエストを送信
        const response = await fetch(`http://127.0.0.1:8000/saunas?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setResults(data.sort((a: any, b: any) => b.rating - a.rating)); // 評価の高い順にソート
      } catch (error) {
        console.error("検索に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    if (keyword || areas) fetchResults();
  }, [keyword, areas]);

  return (
    <Box>
      <Box p={4} textAlign="center">
        <Text fontSize="2xl" fontWeight="bold">
          検索結果
        </Text>
      </Box>
      {loading ? (
        <Spinner size="xl" mt={4} />
      ) : results.length > 0 ? (
        <SimpleGrid columns={1} p={4}>
          {results.map((sauna) => (
            <Box key={sauna.id} p={4} border="1px solid #ccc" borderRadius="md">
              <Text fontWeight="bold">{sauna.name}</Text>
              <Text>{sauna.address}</Text>
              <Text>評価: {sauna.rating || "N/A"}</Text>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Text mt={4} textAlign="center" color="gray.500">
          検索結果がありません。
        </Text>
      )}
    </Box>
  );
};

export default SaunaMap;
