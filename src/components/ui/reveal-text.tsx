"use client";

import { motion, useReducedMotion } from "framer-motion";

export function RevealText({
  children,
  className,
  id,
  as: Tag = "h2",
}: {
  children: string;
  className?: string;
  id?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const shouldReduceMotion = useReducedMotion();
  const words = children.split(" ");

  if (shouldReduceMotion) {
    return <Tag className={className} id={id}>{children}</Tag>;
  }

  return (
    <Tag className={className} id={id}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 12, filter: "blur(2px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.5,
            delay: i * 0.06,
            ease: "easeOut",
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
