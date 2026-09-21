import React from 'react';
import { Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import { Page, Seo } from 'gatsby-theme-portfolio-minimal';
import { AuthorSnippet } from 'gatsby-theme-portfolio-minimal/src/components/AuthorSnippet';
import * as classes from 'gatsby-theme-portfolio-minimal/src/templates/Article/style.module.css';
import { pluralize } from 'gatsby-theme-portfolio-minimal/src/utils/pluralize';
import CommentSection from '../../../components/CommentSection';

// Reference to the prismjs theme
require('gatsby-theme-portfolio-minimal/src/globalStyles/prism.css');

export default function ArticleTemplate(props) {
    const article = props.pageContext.article;
    return (
        <>
            <Seo title={article.title} description={article.description || undefined} useTitleTemplate={true} />
            <Page>
                <article className={classes.Article}>
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
                    <section className={classes.Body}>
                        <div className={classes.Content} dangerouslySetInnerHTML={{ __html: article.body }} />
                        {article.keywords &&
                            article.keywords.map((keyword, key) => {
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
            </Page>
        </>
    );
}
