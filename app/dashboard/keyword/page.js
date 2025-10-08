import Nav from "@/components/Nav";
import React from "react";
import KeywordCollector from "@/components/sudalgaa/keyword";

const page = () => {
  return (
    <Nav className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <KeywordCollector
        initialGoodKeywords={["react", "component"]}
        initialBadKeywords={["bug", "problem"]}
      />
    </Nav>
  );
};

export default page;
