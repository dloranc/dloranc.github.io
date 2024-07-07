import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config: Config = {
  title: 'Dawid Loranc',
  tagline: 'Dinosaurs are cool',
  favicon: 'images/icons/76x76.jpg',

  // Set the production url of your site here
  url: 'https://dloranc.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'dloranc', // Usually your GitHub org/user name.
  projectName: 'dloranc.github.io', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pl'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: {
          blogPostComponent: '@theme/BlogPostPage',
          blogSidebarCount: 0,
          routeBasePath: '/',
          tagsBasePath: '/tags',
          onInlineTags: 'throw',
          archiveBasePath: '/archive',
          showReadingTime: true,
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/dloranc/dloranc.github.io/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'images/avatar.jpg',
    navbar: {
      title: 'Dawid Loranc',
      logo: {
        alt: 'My logo',
        src: 'images/avatar.jpg',
      },
      items: [
        { to: '/', label: 'Blog', position: 'left' },
        { to: 'archive', label: 'Archive', position: 'left' },
        { to: 'tags', label: 'Tags', position: 'left' },
        { to: 'projects', label: 'Projects', position: 'left' },
        { to: 'about-me', label: 'About me', position: 'left' },
        {
          type: 'localeDropdown',
          position: 'left',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Links',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/dloranc',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/dawid-loranc/',
            }
          ],
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java', 'bash', 'lua', 'ini', 'shell-session', 'cpp'],
    },
    algolia: {
      // The application ID provided by Algolia
      appId: '35XYW0PY06',

      // Public API key: it is safe to commit it
      apiKey: '79575f4d8eec1ca26bd01b4f8a47993a',

      indexName: 'dlorancio',

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      externalUrlRegex: 'external\\.com|domain\\.com',

      // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      // replaceSearchResultPathname: {
      //   from: '/docs/', // or as RegExp: /\/docs\//
      //   to: '/',
      // },

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',

      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: false,

      //... other Algolia params
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
