import type { NextPage } from "next";
import { Flex, Text } from "@chakra-ui/react";
import Navbar from "~/components/Navigation";

const Home: NextPage = () => {
  return (
    <Flex flexDir="column" flex={1}>
      <Flex flex={1} alignItems="center" justifyContent="center">
        <Navbar />
        <Text data-cy="title" fontSize="2xl" fontWeight="bold">
          🐏
        </Text>
      </Flex>
    </Flex>
  );
};

export default Home;
