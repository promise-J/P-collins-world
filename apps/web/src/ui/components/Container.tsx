import React from "react";

interface ChildrenProps {
    children: React.ReactNode
}

const Container = ({children}: ChildrenProps) => {
  return <div className="container mx-auto px-1 py-6 md:py-8">{children}</div>;
};

export default Container;
