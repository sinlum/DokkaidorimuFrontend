import React from "react";

const MainContent = () => {
  return (
    <div className="md:ml-64 mt-16 p-2">
      <h1 className="text-2xl font-bold">Articles</h1>
      <div className="mt-4 space-y-4">
        <div className="p-4 bg-white shadow-md rounded">Article 1</div>
        <div className="p-4 bg-white shadow-md rounded">Article 2</div>
        <div className="p-4 bg-white shadow-md rounded">Article 3</div>
      </div>
    </div>
  );
};

export default MainContent;
