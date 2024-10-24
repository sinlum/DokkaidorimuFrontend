import React from "react";

const SECTION_COLORS = ["yellow", "blue", "green", "purple"];

const ArticleSection = ({ bgColor, borderColor, children }) => (
  <p
    className={`bg-${bgColor}-100 p-4 rounded-xl border-l-4 border-${borderColor}-400 mb-4`}
  >
    {children}
  </p>
);

const HighlightedText = ({ color, children }) => (
  <span className={`font-bold text-${color}-600`}>{children}</span>
);

const PlainTextArticleContent = ({ content }) => {
  const paragraphs = content.split("\n").filter((p) => p.trim() !== "");

  return (
    <>
      {paragraphs.map((paragraph, index) => {
        const colorIndex = index % SECTION_COLORS.length;
        const color = SECTION_COLORS[colorIndex];

        // Simple rule: Highlight text between asterisks
        const parts = paragraph.split(/(\*[^*]+\*)/g);

        return (
          <ArticleSection key={index} bgColor={color} borderColor={color}>
            {parts.map((part, partIndex) => {
              if (part.startsWith("*") && part.endsWith("*")) {
                return (
                  <HighlightedText key={partIndex} color={color}>
                    {part.slice(1, -1)}
                  </HighlightedText>
                );
              }
              return part;
            })}
          </ArticleSection>
        );
      })}
    </>
  );
};

export default PlainTextArticleContent;
