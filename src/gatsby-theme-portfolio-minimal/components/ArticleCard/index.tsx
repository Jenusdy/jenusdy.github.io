import React from 'react';
import { Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import SkeletonLoader from 'tiny-skeleton-loader-react';
import { Theme, useGlobalState } from 'gatsby-theme-portfolio-minimal/src/context';
import * as classes from 'gatsby-theme-portfolio-minimal/src/components/ArticleCard/style.module.css';

interface ArticleCardImage {
    alt?: string | null;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    src: {
        childImageSharp: {
            gatsbyImageData: any;
        };
    } | null;
}

export interface ArticleCard {
    image?: ArticleCardImage;
    category: string;
    title: string;
    publishedAt: Date;
    readingTime?: string;
    link: string;
}

interface ArticleCardProps {
    data: ArticleCard;
    showBanner?: boolean;
}

export function ArticleCard(props: ArticleCardProps): React.ReactElement {
    const { globalState } = useGlobalState();
    const darkModeEnabled = globalState.theme === Theme.Dark;
    const showBanner = props.showBanner ?? true;

    // Needed to differentiate between external and internal links (whether or not we use Gatsby Link)
    const absoluteUrl = props.data.link.indexOf('://') > 0 || props.data.link.indexOf('//') === 0;

    const articleCard = (
        <article
            className={classes.Card}
            style={{
                overflow: 'hidden',
                ...(darkModeEnabled ? { border: '0.125rem solid var(--primary-color)' } : {}),
            }}
        >
            {showBanner && props.data.image && props.data.image.src && (
                <div className={classes.Banner}>
                    <GatsbyImage
                        className={classes.ImageWrapper}
                        imgClassName={classes.Image}
                        objectFit={props.data.image.objectFit || 'cover'}
                        image={props.data.image.src.childImageSharp.gatsbyImageData}
                        alt={props.data.image.alt || props.data.title}
                    />
                </div>
            )}
            <div className={classes.DescriptionWrapper}>
                {/* Title on top, category below */}
                <h4 className={classes.Title}>{props.data.title}</h4>
                <span className={classes.Category}>
                    <u>{props.data.category}</u>
                </span>
                <div className={classes.Details}>
                    {formatDate(props.data.publishedAt)}
                    {props.data.readingTime && <span className={classes.ReadingTime}>{props.data.readingTime}</span>}
                </div>
            </div>
        </article>
    );

    return absoluteUrl ? (
        <a href={props.data.link} target="_blank" rel="noopener noreferrer" title={props.data.title}>
            {articleCard}
        </a>
    ) : (
        <Link to={props.data.link} title={props.data.title}>
            {articleCard}
        </Link>
    );
}

export function ArticleCardSkeleton(): React.ReactElement {
    const { globalState } = useGlobalState();
    const darkModeEnabled = globalState.theme === Theme.Dark;
    return (
        <div
            className={classes.Card}
            style={darkModeEnabled ? { border: '0.125rem solid var(--primary-color)' } : undefined}
        >
            <div className={classes.DescriptionWrapper}>
                <SkeletonLoader
                    style={{
                        height: '1.5rem',
                        marginBottom: '.5rem',
                        background: 'var(--tertiary-color)',
                    }}
                />
                <SkeletonLoader
                    style={{
                        height: '.75rem',
                        width: '50%',
                        background: 'var(--tertiary-color)',
                    }}
                />
                <SkeletonLoader
                    style={{
                        height: '.75rem',
                        width: '50%',
                        marginTop: '.5rem',
                        background: 'var(--tertiary-color)',
                    }}
                />
            </div>
        </div>
    );
}

function formatDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
