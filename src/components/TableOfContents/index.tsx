import React, { useState, useRef, useEffect } from 'react';
import * as classes from './style.module.css';

export interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    items: TocItem[];
    activeId: string;
    onHeadingClick: (e: React.MouseEvent, id: string) => void;
    isMobile?: boolean;
}

export function TableOfContents({
    items,
    activeId,
    onHeadingClick,
    isMobile = false,
}: TableOfContentsProps): React.ReactElement | null {
    const [isOpen, setIsOpen] = useState(false);
    const listRef = useRef<HTMLUListElement>(null);

    // Auto-scroll desktop TOC list to keep the active item in view
    useEffect(() => {
        if (isMobile || !activeId || !listRef.current) return;
        const activeLink = listRef.current.querySelector(`[data-toc-id="${activeId}"]`);
        if (activeLink && typeof activeLink.scrollIntoView === 'function') {
            activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [activeId, isMobile]);

    if (!items || items.length === 0) return null;

    const handleItemClick = (e: React.MouseEvent, id: string) => {
        onHeadingClick(e, id);
        if (isMobile) {
            setIsOpen(false);
        }
    };

    const handleBackToTop = (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (typeof window !== 'undefined' && window.history.pushState) {
            window.history.pushState(null, '', window.location.pathname);
        }
    };

    if (isMobile) {
        return (
            <div className={classes.MobileTocWrapper}>
                <button
                    type="button"
                    className={classes.MobileTocToggle}
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-expanded={isOpen}
                    aria-label="Toggle Table of Contents"
                >
                    <span className={classes.MobileTocHeaderLeft}>
                        <span className={classes.MobileTocTitle}>Table of Contents</span>
                        <span className={classes.MobileTocBadge}>{items.length}</span>
                    </span>
                    <span className={`${classes.MobileTocChevron} ${isOpen ? classes.Open : ''}`}>
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </span>
                </button>
                {isOpen && (
                    <div className={classes.MobileTocContent}>
                        <ul className={classes.MobileTocList}>
                            {items.map((item) => {
                                const isActive = activeId === item.id;
                                return (
                                    <li
                                        key={item.id}
                                        className={`${classes.MobileTocItem} ${classes['Level' + item.level]} ${
                                            isActive ? classes.Active : ''
                                        }`}
                                    >
                                        <a
                                            href={`#${item.id}`}
                                            onClick={(e) => handleItemClick(e, item.id)}
                                            className={classes.MobileTocLink}
                                        >
                                            {item.text}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={classes.DesktopTocCard}>
            <div className={classes.DesktopTocHeader}>
                <span className={classes.DesktopTocTitle}>Table of Contents</span>
            </div>
            <nav className={classes.DesktopTocNav} aria-label="Table of Contents">
                <ul ref={listRef} className={classes.DesktopTocList}>
                    {items.map((item) => {
                        const isActive = activeId === item.id;
                        return (
                            <li
                                key={item.id}
                                data-toc-id={item.id}
                                className={`${classes.DesktopTocItem} ${classes['Level' + item.level]} ${
                                    isActive ? classes.Active : ''
                                }`}
                            >
                                <a
                                    href={`#${item.id}`}
                                    onClick={(e) => handleItemClick(e, item.id)}
                                    className={classes.DesktopTocLink}
                                    title={item.text}
                                >
                                    {item.text}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className={classes.DesktopTocFooter}>
                <button
                    type="button"
                    className={classes.BackToTopBtn}
                    onClick={handleBackToTop}
                    title="Scroll to top"
                >
                    Back to top &uarr;
                </button>
            </div>
        </div>
    );
}

export function processArticleBody(html: string): { processedHtml: string; toc: TocItem[] } {
    const toc: TocItem[] = [];
    const slugCounts: Record<string, number> = {};
    let counter = 0;

    const processedHtml = html.replace(
        /<h([1-3])([^>]*)>(.*?)<\/h\1>/gi,
        (match, levelStr, attrs, innerHtml) => {
            const level = parseInt(levelStr, 10);
            const text = innerHtml.replace(/<[^>]+>/g, '').trim();

            let slug = text
                .toLowerCase()
                .replace(/&[a-z0-9#]+;/gi, '')
                .replace(/[^\w\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-');
            if (!slug) slug = `section-${counter++}`;

            if (slugCounts[slug]) {
                slugCounts[slug] += 1;
                slug = `${slug}-${slugCounts[slug] - 1}`;
            } else {
                slugCounts[slug] = 1;
            }

            toc.push({ id: slug, text, level });

            // Remove existing id if any and inject the guaranteed unique id
            const cleanAttrs = attrs.replace(/\s*id=["'][^"']*["']/gi, '');
            return `<h${level} id="${slug}"${cleanAttrs}>${innerHtml}</h${level}>`;
        }
    );

    return { processedHtml, toc };
}
