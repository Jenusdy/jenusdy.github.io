import React from 'react';
import { Animation } from 'gatsby-theme-portfolio-minimal/src/components/Animation';
import { Section } from 'gatsby-theme-portfolio-minimal/src/components/Section';
import { Slider } from 'gatsby-theme-portfolio-minimal/src/components/Slider';
import { ArticleCard, ArticleCardSkeleton } from '../../components/ArticleCard';
import { useSiteMetadata } from 'gatsby-theme-portfolio-minimal/src/hooks/useSiteMetadata';
import { useLocalDataSource, useMediumFeed } from './data';
import { PageSection } from 'gatsby-theme-portfolio-minimal/src/types';
import * as classes from './style.module.css';

enum ArticleSource {
    Medium = 'medium',
    Blog = 'blog',
}

interface ArticleSourceConfiguration {
    [ArticleSource.Medium]?: {
        profileUrl: string;
    };
    [ArticleSource.Blog]?: {
        valid: boolean;
    };
}

interface ArticlesSectionProps extends PageSection {
    sources: ArticleSource[];
}

export function ArticlesSection(props: ArticlesSectionProps): React.ReactElement {
    const response = useLocalDataSource();
    const [articles, setArticles] = React.useState<ArticleCard[]>([]);
    const configuration = validateAndConfigureSources(props.sources);

    async function collectArticlesFromSources(configuration: ArticleSourceConfiguration): Promise<ArticleCard[]> {
        const mediumConfig = configuration[ArticleSource.Medium];
        const blogConfig = configuration[ArticleSource.Blog];
        const articleList: ArticleCard[] = [];

        if (mediumConfig !== undefined) {
            const mediumArticles = await useMediumFeed(mediumConfig.profileUrl);
            if (mediumArticles.length > 0) {
                mediumArticles.forEach((article) => {
                    articleList.push({
                        category: article.categories[0],
                        title: article.title,
                        publishedAt: new Date(article.pubDate.replace(/-/g, '/')),
                        link: article.link,
                    });
                });
            }
        }

        if (blogConfig !== undefined) {
            const blogArticles = response.allArticle.articles;
            if (blogArticles.length > 0) {
                blogArticles.forEach((article) => {
                    articleList.push({
                        image: article.banner,
                        category: article.categories[0],
                        title: article.title,
                        publishedAt: new Date(article.date.replace(/-/g, '/')),
                        link: article.slug,
                        readingTime: article.readingTime.text,
                    });
                });
            }
        }

        return articleList.slice().sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    }

    React.useEffect(() => {
        (async function () {
            setArticles(await collectArticlesFromSources(configuration));
        })();
    }, []);

    return (
        <Animation type="fadeUp" delay={1000}>
            <Section anchor={props.sectionId} heading={props.heading}>
                <Slider additionalClasses={[classes.Articles]}>
                    {articles.length > 0
                        ? articles.slice(0, 3).map((article, key) => {
                              return <ArticleCard key={key} data={article} showBanner={true} />;
                          })
                        : [...Array(3)].map((_, key) => {
                              return <ArticleCardSkeleton key={key} />;
                          })}
                </Slider>
            </Section>
        </Animation>
    );
}

function validateAndConfigureSources(sources: ArticleSource[]): ArticleSourceConfiguration {
    const configuration: ArticleSourceConfiguration = {};

    if (sources.length > 0) {
        if (sources.map((i) => i.toLowerCase()).includes(ArticleSource.Medium)) {
            const siteMetadata = useSiteMetadata();
            configuration[ArticleSource.Medium] = { profileUrl: siteMetadata.social.medium };
        }

        if (sources.map((i) => i.toLowerCase()).includes(ArticleSource.Blog)) {
            configuration[ArticleSource.Blog] = { valid: true };
        }
    } else {
        throw new Error('No Source for Articles defined.');
    }

    return configuration;
}
