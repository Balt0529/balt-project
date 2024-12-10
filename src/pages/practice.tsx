import React from 'react';
import { Box, Text, Center, SimpleGrid, Heading, VStack, Image, Button, Flex, Container} from '@chakra-ui/react';

function App() {
  return (
    <Box bg="blue.600" h="100vh" w="100vw" color="white" position="relative">
        <Container maxW="container.xl" py={8}>
        {/* 上部に「サウナイキタイ」を配置 */}
        <Heading
          position="absolute"
          top="0" // 一番上に配置
          left="50%" // 水平方向の中央
          transform="translateX(-50%)" // 中央揃え補正
          p={4}
        >
        <Text
            fontSize="6xl"
            fontWeight="bold"
            fontFamily="heading"
            transform="skewX(-20deg)"
            textShadow="2px 2px #000"
          >
            サウナ イキタイ
        </Text>
        <SimpleGrid columns={[1, 2, 3]} padding={10}>
          <Box borderWidth={3} borderRadius="lg" p={3}>
            <Center>
              <Heading as="h2" size="md" mb={4}>最新のサ活</Heading>
            </Center>
            <VStack align="start" padding={4}>
              <Box>
                <Text fontWeight="bold">東京都</Text>
                <Text>ライブハウス武道館へようこそ！...</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">北海道</Text>
                <Text>金曜サ活🧖♂️...</Text>
              </Box>
            </VStack>
          </Box>
          
          <Box borderWidth={3} borderRadius="lg" p={4}>
            <Center>
              <Heading as="h2" size="md" mb={4}>人気のサウナ施設</Heading>
            </Center>
            <VStack align="start" padding={4}>
              {/* サウナ施設のリストをここに追加 */}
            </VStack>
          </Box>
          
          <Box borderWidth={3} borderRadius="lg" p={4}>
            <Center>
              <Heading as="h2" size="md" mb={4}>サウナストア</Heading>
            </Center>
            <Image src="https://img.freepik.com/premium-vector/shop-icon-grocery-store-sign-silhouette-building-storage-sale-food_855620-346.jpg?w=360" mb={4} />
            <Center>
              <Button colorScheme="blue" size="md">ショップを見る</Button>
            </Center>
          </Box>
        </SimpleGrid>
        
        <Flex justify="center" mt={10}>
          <Button colorScheme="teal" size="lg">サウナを探す</Button>
        </Flex>
        </Heading>
        </Container>
      </Box>
  );
}

export default App;
