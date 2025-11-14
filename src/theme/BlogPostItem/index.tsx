import React from "react";
import clsx from "clsx";
import { useBlogPost } from "@docusaurus/theme-common/internal";
import BlogPostItemContainer from "@theme/BlogPostItem/Container";
import BlogPostItemHeader from "@theme/BlogPostItem/Header";
import BlogPostItemContent from "@theme/BlogPostItem/Content";
import BlogPostItemFooter from "@theme/BlogPostItem/Footer";
import type { Props } from "@theme/BlogPostItem";

export default function BlogPostItem({
  children,
  className,
}: Props): JSX.Element {
  const { isBlogPostPage } = useBlogPost();
  const containerClassName = !isBlogPostPage ? "margin-bottom--lg" : undefined;

  return (
    <BlogPostItemContainer className={clsx(containerClassName, className)}>
      <BlogPostItemHeader />
      {isBlogPostPage && <BlogPostItemContent>{children}</BlogPostItemContent>}
      {isBlogPostPage && <BlogPostItemFooter />}
    </BlogPostItemContainer>
  );
}
