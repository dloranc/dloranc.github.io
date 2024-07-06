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

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'pl',
    locales: ['pl'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: {
          blogSidebarCount: 0,
          routeBasePath: '/',
          tagsBasePath: '/tagi',
          archiveBasePath: '/archiwum',
          showReadingTime: true,
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/dloranc/dloranc.github.io/tree/main/packages/create-docusaurus/templates/shared/',
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
        { to: '/archiwum', label: 'Archiwum', position: 'left' },
        { to: '/tagi', label: 'Tagi', position: 'left' },
        { to: '/projekty', label: 'Projekty', position: 'left' },
        { to: '/o-mnie', label: 'O mnie', position: 'left' },
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
  } satisfies Preset.ThemeConfig,
};

export default config;
