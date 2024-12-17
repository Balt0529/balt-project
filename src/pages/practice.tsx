import { Box, Grid, GridItem, Text, Center, Button, HStack, VStack, Link, AbsoluteCenter, Input, Kbd,} from "@chakra-ui/react"
import { InputGroup } from "@/components/ui/input-group"
import { FaSearch } from "react-icons/fa"
import { keyframes } from "@emotion/react";

const slideShow = keyframes`
  0%, 25% { background-image: url('/Images/ROOFTOPサ室.jpg'); }
  26%, 50% { background-image: url('/Images/サウナ東京.jpg'); }
  51%, 75% { background-image: url('/Images/ととのい.jpg'); }
  76%, 100% { background-image: url('/Images/totonoi.jpg'); }
`;


const Demo = () => {

  return (
    <>
    <Box 
      h={"90vh"}
      bgSize="cover" // 背景を拡大して全体を覆う
      animation={`${slideShow} 20s infinite`} // アニメーション設定
      bgBlendMode="overlay" // 背景画像と青色を合成
      bgColor="blue.700" // 背景色を青に設定
      // opacity="0.7" // 全体の透明度を調整（任意）
      position="relative">
      <Box h={"10%"}>
        <Grid templateColumns="repeat(5, 1fr)">
          <GridItem colSpan={2}>
              <Link href="#" color="white" ml={10} mt={3}>ととのうとは？</Link>
              <Link href="#" color="white" ml={4} mt={3}>みんなのサ活</Link>
              <Link href="#" color="white" ml={4} mt={3}>サ活投稿</Link>
          </GridItem>
          <GridItem colSpan={2}>
          </GridItem>
          <GridItem colSpan={1}>
            <Link href="#" color="white" ml={10} mt={3}>ログイン</Link>
            <Button colorPalette="red" variant="solid" ml={4}> 新規登録</Button>
          </GridItem>
        </Grid>
      </Box>

      <Box h="90%">
      <AbsoluteCenter>
        <VStack>
          <Text fontWeight="100" fontSize="xl" color="white">
            お気に入りのサウナ検索・サ活投稿ができるサイト
          </Text>
          <Text fontWeight="1000" fontSize="7xl" color="white" textShadow="3px 3px 10px white">
            サウナ
          </Text>
          <Text fontWeight="1000" fontSize="7xl" color="white" textShadow="3px 3px 10px white">
            ツアーズ
          </Text>
          <InputGroup width="sm" flex="1" startElement={<FaSearch />}>
            <Input placeholder="Let's search SAUNA!" bg="white" color="black"/>
          </InputGroup>
        </VStack>
      </AbsoluteCenter>
      </Box>
    </Box>

    <Box h={"90vh"} m="4" p="3">
      <Text fontSize="3xl" textDecoration="underline">
        ’ととのう’とは
      </Text>
    </Box>

    </>
  )
}

export default Demo;

