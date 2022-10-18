import React, { ReactNode } from 'react'
import { docUrl, imgUrl, pageUrl } from '../lib/url'

import { BrowserScreenshot } from '../components/browser-screenshot'
import { CTAButtons } from '../components/cta-buttons'
import { FeatureBlock } from '../components/feature-block'
import Layout from '@theme/Layout'
import { MarkdownBlock } from '../components/markdown-block'
import siteConfig from '../../docusaurus.config'
import styles from './index.module.css'

const SplashContainer = ({ children }: { children: ReactNode }) => (
  <div
    className={styles.homeContainer}
    style={{
      backgroundImage: `url(${imgUrl('bg-title.jpg')})`,
    }}
  >
    <div className={styles.homeSplashFade}>
      <div className={styles.homeWrapper}>{children}</div>
    </div>
  </div>
)

const ProjectTitle = () => (
  <h2 className={styles.projectTitle}>
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
)
const Logo = ({ imgSrc }: { imgSrc: string }) => (
  <div className={styles.projectLogo}>
    {siteConfig.tagline && (
      <div className={styles.tagline}>{siteConfig.tagline}</div>
    )}
    <img src={imgSrc} />
  </div>
)

const HomeSplash = ({ language }: { language?: string }) => (
  <SplashContainer>
    <Logo imgSrc={imgUrl('logo-with-shadow.svg')} />
    <ProjectTitle />
    <CTAButtons language={language} />
  </SplashContainer>
)

const FooterButtons = ({ language }: { language?: string }) => (
  <div className={styles.footerButtons}>
    <CTAButtons language={language} isHighlight />
  </div>
)

const FeatureTour = ({ language }: { language?: string }) => (
  <div>
    <FeatureBlock
      className={styles.tour}
      title='Web-based'
      image={
        <BrowserScreenshot
          alt='Screenshot'
          src={imgUrl('screenshots/mode-selection.jpg')}
        />
      }
      imageAlign='left'
    >
      Play instantly from your browser.
      <br />
      No plugins required.
    </FeatureBlock>

    <FeatureBlock
      className={styles.tour}
      title='Play with your keyboard'
      image={
        <BrowserScreenshot
          alt='Screenshot'
          src={imgUrl('screenshots/gameplay-kbd.jpg')}
        />
      }
      imageAlign='right'
    >
      Hit the notes with your keyboard to recreate the song.
      <br />
      Play more accurately to get higher score!
    </FeatureBlock>

    <FeatureBlock
      className={styles.tour}
      title='BMS Mode'
      image={
        <BrowserScreenshot
          alt='Screenshot'
          src={imgUrl('screenshots/gameplay-bms.jpg')}
        />
      }
      imageAlign='left'
    >
      <MarkdownBlock>{`More challenge with an extra turntable lane! \\\nYou can also play using an [IIDX controller](https://www.youtube.com/watch?v=EOgI37Myqvk) or [MIDI controller](https://www.facebook.com/bemusegame/videos/985712734835136/). \\\nThis mode is similar to beatmaniaIIDX and LR2.`}</MarkdownBlock>
    </FeatureBlock>

    <FeatureBlock
      className={styles.tour}
      title='Wide variety of music'
      image={
        <BrowserScreenshot
          alt='Screenshot'
          src={imgUrl('screenshots/music-selection.jpg')}
        />
      }
      imageAlign='right'
    >
      <MarkdownBlock>{`More than [50 songs](/project/music.html) to choose, handpicked from various genres.`}</MarkdownBlock>
    </FeatureBlock>

    <FeatureBlock
      className={styles.tour}
      title='Custom Servers'
      image={
        <BrowserScreenshot
          alt='Screenshot'
          src={imgUrl('screenshots/music-server.png')}
        />
      }
      imageAlign='left'
    >
      <MarkdownBlock>{`If you would like to host your own music server with custom song sets, you can! [Click here](${docUrl(
        'music-server.html',
        language
      )}) to learn how.`}</MarkdownBlock>
    </FeatureBlock>

    <FeatureBlock
      className={styles.tour}
      title='Open Source'
      image={<img alt='Screenshot' src={imgUrl('screenshots/oss.png')} />}
      imageAlign='right'
    >
      <MarkdownBlock>{`Bemuse is free and open source (licensed under [AGPLv3](https://github.com/bemusic/bemuse/blob/master/LICENSE)), made awesome by [our contributors](https://github.com/bemusic/bemuse/graphs/contributors).\n\nContributions are welcome! [Click here](${pageUrl(
        'contribute.html',
        language
      )}) to get started, and have a look at our [issues page](https://github.com/bemusic/bemuse/issues).`}</MarkdownBlock>
    </FeatureBlock>
  </div>
)

const Index = ({ language }: { language?: string }) => (
  <>
    <HomeSplash language={language} />
    <FeatureTour />
    <FooterButtons />
  </>
)

export default (props: { language?: string }) => (
  <Layout>
    <Index {...props} />
  </Layout>
)
