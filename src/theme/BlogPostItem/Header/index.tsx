import React from "react";
import { useBlogPost } from "@docusaurus/theme-common/internal";
import BlogPostItemHeaderTitle from "@theme/BlogPostItem/Header/Title";
import BlogPostItemHeaderInfo from "@theme/BlogPostItem/Header/Info";
import BlogPostItemHeaderAuthors from "@theme/BlogPostItem/Header/Authors";

import styles from "./styles.module.css";

export default function BlogPostItemHeader(): JSX.Element {
  const { isBlogPostPage } = useBlogPost();

  if (isBlogPostPage) {
    return (
      <header>
        <BlogPostItemHeaderTitle />
        <div className={styles.postInfo}>
          <BlogPostItemHeaderInfo />
        </div>
        <BlogPostItemHeaderAuthors />
      </header>
    );
  }

  return (
    <header className={styles.listHeader}>
      <div className={styles.listInfo}>
        <BlogPostItemHeaderInfo />
      </div>
      <BlogPostItemHeaderTitle />
      <BlogPostItemHeaderAuthors />
    </header>
  );
}
