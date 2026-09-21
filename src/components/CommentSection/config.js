/**
 * Configuration for the Article Comments Section.
 *
 * To get your exact Giscus repoId and categoryId:
 * 1. Ensure "Discussions" feature is enabled in your GitHub repo:
 *    https://github.com/Jenusdy/jenusdy.github.io/settings (check "Discussions")
 * 2. Visit https://giscus.app and input "Jenusdy/jenusdy.github.io"
 * 3. Choose a discussion category (e.g. "General" or "Announcements")
 * 4. Copy the generated data-repo-id and data-category-id below.
 */
export const commentConfig = {
  provider: 'giscus', // 'giscus' | 'utterances'
  giscus: {
    repo: 'Jenusdy/jenusdy.github.io',
    repoId: 'R_kgDOOQsDxQ',
    category: 'General',
    categoryId: 'DIC_kwDOOQsDxc4DGGic', // Exact Discussion Category ID for 'General'
    mapping: 'pathname',
    strict: '0',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'top',
    lang: 'en',
    themeLight: 'light',
    themeDark: 'transparent_dark',
  },
  utterances: {
    repo: 'Jenusdy/jenusdy.github.io',
    issueTerm: 'pathname',
    label: 'comment',
    themeLight: 'github-light',
    themeDark: 'github-dark',
  },
};
