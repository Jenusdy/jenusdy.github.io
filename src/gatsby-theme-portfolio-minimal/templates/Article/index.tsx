import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import { Page, Seo } from 'gatsby-theme-portfolio-minimal';
import { AuthorSnippet } from 'gatsby-theme-portfolio-minimal/src/components/AuthorSnippet';
import * as classes from 'gatsby-theme-portfolio-minimal/src/templates/Article/style.module.css';
import * as layoutClasses from './layout.module.css';
import { pluralize } from 'gatsby-theme-portfolio-minimal/src/utils/pluralize';
import CommentSection from '../../../components/CommentSection';
import { TableOfContents, processArticleBody } from '../../../components/TableOfContents';

// Reference to the prismjs theme
require('gatsby-theme-portfolio-minimal/src/globalStyles/prism.css');

interface ArticleTemplateProps {
    pageContext: {
        article: any;
        listingPagePath: string;
        entityName?: string;
    };
}

export default function ArticleTemplate(props: ArticleTemplateProps): React.ReactElement {
    const article = props.pageContext.article;

    // Process article body to inject IDs to headings and extract TOC hierarchy
    const { processedHtml, toc } = useMemo(() => {
        return processArticleBody(article.body || '');
    }, [article.body]);

    const [activeId, setActiveId] = useState<string>(toc[0]?.id || '');

    // Smooth scroll to section when a TOC item is clicked
    const handleHeadingClick = useCallback((e: React.MouseEvent, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveId(id);
            if (typeof window !== 'undefined' && window.history.pushState) {
                window.history.pushState(null, '', `#${id}`);
            }
        }
    }, []);

    // Scrollspy: update active heading based on viewport scroll position
    useEffect(() => {
        if (typeof window === 'undefined' || toc.length === 0) return;

        const headingElements = toc
            .map((item) => document.getElementById(item.id))
            .filter((el): el is HTMLElement => el !== null);

        if (headingElements.length === 0) return;

        let timeoutId: number | null = null;

        const onScroll = () => {
            if (timeoutId !== null) return;
            timeoutId = window.setTimeout(() => {
                timeoutId = null;
                const offset = 140; // viewport threshold offset

                let currentActiveId = headingElements[0].id;
                for (let i = 0; i < headingElements.length; i++) {
                    const el = headingElements[i];
                    const top = el.getBoundingClientRect().top;
                    if (top <= offset) {
                        currentActiveId = el.id;
                    } else {
                        break;
                    }
                }
                setActiveId(currentActiveId);
            }, 50);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        // If URL initially had an anchor hash, smooth scroll to it
        if (window.location.hash) {
            const initialId = decodeURIComponent(window.location.hash.slice(1));
            const initialEl = document.getElementById(initialId);
            if (initialEl) {
                setTimeout(() => {
                    initialEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setActiveId(initialId);
                }, 350);
            }
        }

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (timeoutId !== null) clearTimeout(timeoutId);
        };
    }, [toc]);

    return (
        <>
            <Seo title={article.title} description={article.description || undefined} useTitleTemplate={true} />
            <Page>
                <div className={layoutClasses.ArticlePageWrapper}>
                    <article className={`${classes.Article} ${layoutClasses.ArticleColumn}`}>
                        <div className={classes.Breadcrumb}>
                            <Link
                                to={props.pageContext.listingPagePath}
                                title={`Back To All ${pluralize(props.pageContext.entityName) ?? 'Articles'}`}
                            >
                                <span className={classes.BackArrow}>&#10094;</span>
                                All {pluralize(props.pageContext.entityName) ?? 'Articles'}
                            </Link>
                        </div>
                        <section className={classes.Header}>
                            <span className={classes.Category}>{article.categories.join(' / ')}</span>
                            <h1>{article.title}</h1>
                            <div className={classes.Details}>
                                {article.date}
                                <span className={classes.ReadingTime}>{article.readingTime.text}</span>
                            </div>
                        </section>
                        {article.banner && article.banner.src && (
                            <section className={classes.Banner}>
                                <GatsbyImage
                                    image={article.banner.src.childImageSharp.gatsbyImageData}
                                    alt={article.banner.alt || `Image for ${article.title}`}
                                    imgClassName={classes.BannerImage}
                                />
                                {article.banner.caption && (
                                    <span
                                        className={classes.BannerCaption}
                                        dangerouslySetInnerHTML={{ __html: article.banner.caption }}
                                    />
                                )}
                            </section>
                        )}

                        {/* Mobile Collapsible TOC */}
                        {toc.length > 0 && (
                            <div className={layoutClasses.MobileTocSection}>
                                <TableOfContents
                                    items={toc}
                                    activeId={activeId}
                                    onHeadingClick={handleHeadingClick}
                                    isMobile={true}
                                />
                            </div>
                        )}

                        <section className={classes.Body}>
                            <div className={classes.Content} dangerouslySetInnerHTML={{ __html: processedHtml }} />
                            {article.keywords &&
                                article.keywords.map((keyword: string, key: number) => {
                                    return (
                                        <span key={key} className={classes.Keyword}>
                                            {keyword}
                                        </span>
                                    );
                                })}
                        </section>
                        <section className={classes.Footer}>
                            <AuthorSnippet />
                            <CommentSection />
                        </section>
                    </article>

                    {/* Desktop Sticky Right Sidebar TOC */}
                    {toc.length > 0 && (
                        <aside className={layoutClasses.TocSidebar}>
                            <TableOfContents
                                items={toc}
                                activeId={activeId}
                                onHeadingClick={handleHeadingClick}
                                isMobile={false}
                            />
                        </aside>
                    )}
                </div>
            </Page>
        </>
    );
}
