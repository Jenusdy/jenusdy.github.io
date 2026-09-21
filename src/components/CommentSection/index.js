/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { useGlobalState, Theme } from 'gatsby-theme-portfolio-minimal/src/context';
import { commentConfig } from './config';
import * as classes from './style.module.css';

export default function CommentSection() {
  const containerRef = useRef(null);
  const { globalState } = useGlobalState();
  const isDark = globalState?.theme === Theme.Dark;

  // Load the script when component mounts
  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous comments if any
    containerRef.current.innerHTML = '';

    if (commentConfig.provider === 'giscus') {
      const cfg = commentConfig.giscus;
      const script = document.createElement('script');
      script.src = 'https://giscus.app/client.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.setAttribute('data-repo', cfg.repo);
      script.setAttribute('data-repo-id', cfg.repoId);
      script.setAttribute('data-category', cfg.category);
      if (cfg.categoryId) {
        script.setAttribute('data-category-id', cfg.categoryId);
      }
      script.setAttribute('data-mapping', cfg.mapping);
      script.setAttribute('data-strict', cfg.strict || '0');
      script.setAttribute('data-reactions-enabled', cfg.reactionsEnabled || '1');
      script.setAttribute('data-emit-metadata', cfg.emitMetadata || '0');
      script.setAttribute('data-input-position', cfg.inputPosition || 'top');
      script.setAttribute('data-theme', isDark ? cfg.themeDark : cfg.themeLight);
      script.setAttribute('data-lang', cfg.lang || 'en');
      script.setAttribute('data-loading', 'lazy');

      containerRef.current.appendChild(script);
    } else if (commentConfig.provider === 'utterances') {
      const cfg = commentConfig.utterances;
      const script = document.createElement('script');
      script.src = 'https://utteranc.es/client.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.setAttribute('repo', cfg.repo);
      script.setAttribute('issue-term', cfg.issueTerm || 'pathname');
      if (cfg.label) {
        script.setAttribute('label', cfg.label);
      }
      script.setAttribute('theme', isDark ? cfg.themeDark : cfg.themeLight);

      containerRef.current.appendChild(script);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update theme dynamically when user toggles light/dark mode
  useEffect(() => {
    if (commentConfig.provider === 'giscus') {
      const iframe = document.querySelector('iframe.giscus-frame');
      if (iframe && iframe.contentWindow) {
        const theme = isDark ? commentConfig.giscus.themeDark : commentConfig.giscus.themeLight;
        iframe.contentWindow.postMessage(
          {
            giscus: {
              setConfig: {
                theme: theme,
              },
            },
          },
          'https://giscus.app'
        );
      }
    }
  }, [isDark]);

  return (
    <section className={classes.CommentSection}>
      <h2 className={classes.Title}>Discussion & Comments</h2>
      <p className={classes.Subtitle}>
        Share your thoughts, suggestions, or writeup discussions below. Powered by GitHub.
      </p>
      <div ref={containerRef} className={classes.CommentsContainer} />
    </section>
  );
}
