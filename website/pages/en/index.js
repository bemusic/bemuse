'use strict'

const React = require('react')

const CompLibrary = require('../../core/CompLibrary.js')
// const MarkdownBlock = CompLibrary.MarkdownBlock /* Used to read markdown */
const Container = CompLibrary.Container
const GridBlock = CompLibrary.GridBlock

const siteConfig = require(process.cwd() + '/siteConfig.js')

function imgUrl (img) {
  return siteConfig.baseUrl + 'img/' + img
}

function docUrl (doc, language) {
  return siteConfig.baseUrl + 'docs/' + (language ? language + '/' : '') + doc
}

function pageUrl (page, language) { // eslint-disable-line
  return siteConfig.baseUrl + (language ? language + '/' : '') + page
}

class Button extends React.Component {
  render () {
    return (
      <div className='pluginWrapper buttonWrapper'>
        <a className='button' href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    )
  }
}

Button.defaultProps = {
  target: '_self'
}

const SplashContainer = props => (
  <div className='homeContainer' style={{
    backgroundImage: `url(${imgUrl('bg-title.jpg')})`
  }}>
    <div className='homeSplashFade'>
      <div className='wrapper homeWrapper'>{props.children}</div>
    </div>
  </div>
)

const Logo = props => (
  <div className='projectLogo'>
    {siteConfig.tagline && <div className='tagline'>{siteConfig.tagline}</div>}
    <img src={props.img_src} />
  </div>
)

const ProjectTitle = props => (
  <h2 className='projectTitle'>
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
)

const PromoSection = props => (
  <div className='section promoSection'>
    <div className='promoRow'>
      <div className='pluginRowBlock'>{props.children}</div>
    </div>
  </div>
)

const CTAButtons = props => (
  <PromoSection>
    <Button href='https://bemuse.ninja' target='blank' rel='noopener noreferrer'>Play Now</Button>
    <Button href={docUrl('user-guide.html', props.language || '')}>Read the Docs</Button>
    <Button href={pageUrl('contribute.html', props.language || '')}>Contribute</Button>
  </PromoSection>
)

class HomeSplash extends React.Component {
  render () {
    let language = this.props.language || ''
    return (
      <SplashContainer>
        <Logo img_src={imgUrl('logo-with-shadow.svg')} />
        <div className='inner'>
          <ProjectTitle />
          <CTAButtons language={language} />
        </div>
      </SplashContainer>
    )
  }
}

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}
  >
    <GridBlock align='center' contents={props.children} layout={props.layout} />
  </Container>
)

const FooterButtons = props => (
  <div
    className='productShowcaseSection highlightBackground'
    style={{ textAlign: 'center' }}
  >
    <CTAButtons language={props.language || ''} />
  </div>
)

const FeatureTour = props => (
  <div>
    <Block>
      {[
        {
          content: 'Play instantly from your browser.\n\nNo plugins required.',
          image: imgUrl('screenshots/gameplay-kbd.jpg'),
          imageAlign: 'left',
          title: 'Web-based'
        }
      ]}
    </Block>
    <Block background='light'>
      {[
        {
          content: 'Hit the notes with your keyboard to recreate the song.\n\nPlay more accurately to get higher score!',
          image: imgUrl('screenshots/gameplay-kbd.jpg'),
          imageAlign: 'right',
          title: 'Play with your keyboard'
        }
      ]}
    </Block>
    <Block>
      {[
        {
          content: `More challenge with an extra turntable lane!\n\nYou can also play using an [IIDX controller](https://www.youtube.com/watch?v=EOgI37Myqvk) or [MIDI controller](https://www.facebook.com/bemusegame/videos/985712734835136/).\n\nThis mode is similar to beatmaniaIIDX and LR2.`,
          image: imgUrl('screenshots/gameplay-bms.jpg'),
          imageAlign: 'left',
          title: 'BMS Mode'
        }
      ]}
    </Block>
    <Block background='light'>
      {[
        {
          content: `More than [50 songs](/project/music.html) to choose, handpicked from various genres.`,
          image: imgUrl('screenshots/music-select.jpg'),
          imageAlign: 'right',
          title: 'Wide variety of music'
        }
      ]}
    </Block>
    <Block>
      {[
        {
          content: `If you would like to host your own music server with custom song sets, you can! [Click here](${docUrl('users-music-server.html', props.language || '')}) to learn how.`,
          image: imgUrl('screenshots/music-select.jpg'),
          imageAlign: 'left',
          title: 'Custom Servers'
        }
      ]}
    </Block>
    <Block background='light'>
      {[
        {
          content: `Bemuse is free and open source (licensed under [AGPLv3](https://github.com/bemusic/bemuse/blob/master/LICENSE)), made awesome by [our contributors](https://github.com/bemusic/bemuse/graphs/contributors).\n\nContributions are welcome! [Click here](${pageUrl('contribute.html', props.language || '')}) to get started, and have a look at our [issues page](https://github.com/bemusic/bemuse/issues).`,
          image: imgUrl('screenshots/oss.png'),
          imageAlign: 'right',
          title: 'Open Source'
        }
      ]}
    </Block>
  </div>
)

class Index extends React.Component {
  render () {
    let language = this.props.language || ''

    return (
      <div>
        <HomeSplash language={language} />
        <div className='mainContainer'>
          <FeatureTour />
          <FooterButtons />
        </div>
      </div>
    )
  }
}

module.exports = Index
