import React from "react";
import {
  AboutSection,
  HeroSection,
  InterestsSection,
  Page,
  ProjectsSection,
  Seo,
} from "gatsby-theme-portfolio-minimal";
import { ArticlesSection } from "../gatsby-theme-portfolio-minimal/sections/Articles";

export default function IndexPage() {
  return (
    <>
      <Seo title="Jenusdy's Portfolio" />
      <Page useSplashScreenAnimation>
        <HeroSection sectionId="hero" />
        <AboutSection sectionId="about" heading="About Me" />
        <ArticlesSection
          sectionId="articles"
          heading="Latest Articles"
          sources={["Blog"]}
        />
        <InterestsSection sectionId="details" heading="Skills" />
        <ProjectsSection sectionId="projects" heading="Projects" />
      </Page>
    </>
  );
}
