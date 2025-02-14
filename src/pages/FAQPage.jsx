import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";

const FaqSection = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const contentRefs = useRef([]);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "1. What is TradeFinder?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem unde corporis perferendis velit quasi culpa hic qui, fuga laboriosam pariatur doloribus accusamus! Placeat recusandae, similique eos odio vero delectus hic ab labore magni est.",
    },
    {
      question: "2. Who can use TradeFinder?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem unde corporis perferendis velit quasi culpa hic qui, fuga laboriosam pariatur doloribus accusamus! Placeat recusandae, similique eos odio vero delectus hic ab labore magni est.",
    },
    {
      question: "3. How do I sign up for TradeFinder?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem unde corporis perferendis velit quasi culpa hic qui, fuga laboriosam pariatur doloribus accusamus! Placeat recusandae, similique eos odio vero delectus hic ab labore magni est.",
    },
    {
      question: "4. What kind of trading strategies does TradeFinder support?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem unde corporis perferendis velit quasi culpa hic qui, fuga laboriosam pariatur doloribus accusamus! Placeat recusandae, similique eos odio vero delectus hic ab labore magni est.",
    },
    {
      question:
        "5. Does TradeFinder offer educational resources for beginners?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem unde corporis perferendis velit quasi culpa hic qui, fuga laboriosam pariatur doloribus accusamus! Placeat recusandae, similique eos odio vero delectus hic ab labore magni est.",
    },
    {
      question:
        "6. Can I integrate my existing brokerage account with TradeFinder?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem unde corporis perferendis velit quasi culpa hic qui, fuga laboriosam pariatur doloribus accusamus! Placeat recusandae, similique eos odio vero delectus hic ab labore magni est.",
    },
    {
      question:
        "7. How does TradeFinder differentiate itself from other trading platforms?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem unde corporis perferendis velit quasi culpa hic qui, fuga laboriosam pariatur doloribus accusamus! Placeat recusandae, similique eos odio vero delectus hic ab labore magni est.",
    },
    {
      question: "8. What kind of customer support does TradeFinder offer?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem unde corporis perferendis velit quasi culpa hic qui, fuga laboriosam pariatur doloribus accusamus! Placeat recusandae, similique eos odio vero delectus hic ab labore magni est.",
    },
    {
      question:
        "9. Are there any additional costs or fees for using TradeFinder?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem unde corporis perferendis velit quasi culpa hic qui, fuga laboriosam pariatur doloribus accusamus! Placeat recusandae, similique eos odio vero delectus hic ab labore magni est.",
    },
    {
      question: "10. How can I update or cancel my subscription?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem unde corporis perferendis velit quasi culpa hic qui, fuga laboriosam pariatur doloribus accusamus! Placeat recusandae, similique eos odio vero delectus hic ab labore magni est.",
    },
    {
      question: "11. Is TradeFinder available on mobile devices?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem unde corporis perferendis velit quasi culpa hic qui, fuga laboriosam pariatur doloribus accusamus! Placeat recusandae, similique eos odio vero delectus hic ab labore magni est.",
    },
    {
      question: "12. Can I access TradeFinder from multiple devices?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem unde corporis perferendis velit quasi culpa hic qui, fuga laboriosam pariatur doloribus accusamus! Placeat recusandae, similique eos odio vero delectus hic ab labore magni est.",
    },
  ];

  useEffect(() => {
    contentRefs.current = contentRefs.current.slice(0, faqs.length);
  }, [faqs]);

  return (<>





    <div className="w-full mx-auto ">
      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-gray-300">
          {/* Question Section */}
          <div
            className="py-4 px-4 cursor-pointer flex gap-2 items-center"
            onClick={() => toggleFAQ(index)}
          >
            <span className="text-[#6B1EE6]">
              {activeIndex === index ? (
                <FaMinus className="text-lg font-semibold" />
              ) : (
                <FaPlus className="text-lg font-semibold" />
              )}
            </span>
            <h3 className="text-lg font-semibold text-[#6B1EE6]">
              {faq.question}
            </h3>
          </div>

          {/* Answer Section */}
          <div
            ref={(el) => (contentRefs.current[index] = el)}
            className={`overflow-hidden transition-[height,opacity] duration-500 ease-in-out border-t border-gray-300`}
            style={{
              height:
                activeIndex === index
                  ? `${contentRefs.current[index]?.scrollHeight}px`
                  : "0px",
              opacity: activeIndex === index ? 1 : 0,
            }}
          >
            <ul className="space-y-4 p-4">
              {faq.answer.map((answer, index) => (
                <li key={index} className="text-base  text-[#2B016E]">
                  {answer}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
      </>
  );
};

export default FaqSection;
