import { Button, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaBook } from "react-icons/fa";

export function ItemTableButton() {
  const router = useRouter();

  return (
    <Button
      colorScheme="blue"
      onClick={() => router.push("/sauna")}
    >
      <Icon as={FaBook} mr={2} />
      Sauna Table
    </Button>
  );
}
