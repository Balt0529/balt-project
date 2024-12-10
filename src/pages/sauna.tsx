import React from 'react';
import { Box, Container, Center, Flex, Heading, Text, Button, Image, VStack, SimpleGrid } from '@chakra-ui/react';

const SaunaApp = () => {
  return (
    <Box>
      <Container maxW="container.xl" py={8}>
        <Center>
          <Heading as="h1" size="7xl" color="blue.500" mb={10} transform="skewX(-20deg)" textShadow="2px 2px #000">サウナイキタイ</Heading>
        </Center>
        
        <SimpleGrid columns={[1, 2, 3]} padding={10}>
          <Box borderWidth={1} borderRadius="lg" p={4}>
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
          
          <Box borderWidth={1} borderRadius="lg" p={4}>
            <Center>
              <Heading as="h2" size="md" mb={4}>人気のサウナ施設</Heading>
            </Center>
            <VStack align="start" padding={4}>
              {/* サウナ施設のリストをここに追加 */}
            </VStack>
          </Box>
          
          <Box borderWidth={1} borderRadius="lg" p={4}>
            <Center>
              <Heading as="h2" size="md" mb={4}>サウナストア</Heading>
            </Center>
            <Image src="https://img.freepik.com/premium-vector/shop-icon-grocery-store-sign-silhouette-building-storage-sale-food_855620-346.jpg?w=360" mb={4} />
            <Center>
              <Button colorScheme="blue">ショップを見る</Button>
            </Center>
          </Box>
        </SimpleGrid>
        
        <Flex justify="center" mt={10}>
          <Button colorScheme="teal" size="lg">サウナを探す</Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default SaunaApp;