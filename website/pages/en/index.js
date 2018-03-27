'use strict'

const React = require('react')

const CompLibrary = require('../../core/CompLibrary.js')
const MarkdownBlock = CompLibrary.MarkdownBlock /* Used to read markdown */
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

class HomeSplash extends React.Component {
  render () {
    let language = this.props.language || ''
    return (
      <SplashContainer>
        <Logo img_src={imgUrl('logo-with-shadow.svg')} />
        <div className='inner'>
          <ProjectTitle />
          <PromoSection>
            <Button href='https://bemuse.ninja' target='blank' rel='noopener noreferrer'>Try It Out</Button>
            <Button href={docUrl('users-gameplay.html', language)}>Read User Docs</Button>
            <Button href={docUrl('developers-getting-started.html', language)}>Read Developer Docs</Button>
          </PromoSection>
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

const Features = props => (
  <Block background='highlight' layout='twoColumn'>
    {[
      {
        content: 'Handpicked from various genres.',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'top',
        title: '50+ Songs'
      },
      {
        content: 'Compete with other players online.',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'top',
        title: 'Online Rankings'
      }
    ]}
  </Block>
)

const FeatureCallout = props => (
  <div
    className='productShowcaseSection highlightBackground paddingBottom'
    style={{ textAlign: 'center' }}
  >
    <h2>Web-based</h2>
    <MarkdownBlock>{'Play instantly from your browser.<br>No extra plugins required.'}</MarkdownBlock>
  </div>
)

const FooterButtons = props => (
  <div
    className='productShowcaseSection highlightBackground'
    style={{ textAlign: 'center' }}
  >
    <PromoSection>
      <Button href='https://bemuse.ninja' target='blank' rel='noopener noreferrer'>Try It Out</Button>
      <Button href={docUrl('users-gameplay.html', props.language || '')}>Read User Docs</Button>
      <Button href={docUrl('developers-getting-started.html', props.language || '')}>Read Developer Docs</Button>
    </PromoSection>
  </div>
)

const FeatureTour = props => (
  <React.Fragment>
    <Block background='light'>
      {[
        {
          content: `You can play using an [IIDX controller](https://www.youtube.com/watch?v=EOgI37Myqvk) or [MIDI controller](https://www.facebook.com/bemusegame/videos/985712734835136/).\n\nThis mode is similar to beatmaniaIIDX and LR2.`,
          image: imgUrl('screenshots/gameplay-bms.jpg'),
          imageAlign: 'right',
          title: 'BMS Mode'
        }
      ]}
    </Block>
    <Block>
      {[
        {
          content: 'Play along the music with your keyboard.\n\nThis mode is similar to O2Jam.',
          image: imgUrl('screenshots/gameplay-kbd.jpg'),
          imageAlign: 'left',
          title: 'Keyboard Mode'
        }
      ]}
    </Block>
    <Block background='light'>
      {[
        {
          content: `If you would like to host your own music server with custom song packs, you can! [Click here](${docUrl('users-music-server.html', props.language || '')}) to learn how.`,
          image: imgUrl('screenshots/music-select.jpg'),
          imageAlign: 'right',
          title: 'Custom Servers'
        }
      ]}
    </Block>
    <Block>
      {[
        {
          content: `Bemuse is free and open source (licensed under [AGPLv3](https://github.com/bemusic/bemuse/blob/master/LICENSE)), made awesome by [our contributors](https://github.com/bemusic/bemuse/graphs/contributors).\n\nContributions are welcome! [Click here](${pageUrl('contribute.html', props.language || '')}) to get started, and have a look at our [issues page](https://github.com/bemusic/bemuse/issues).`,
          image: imgUrl('screenshots/oss.png'),
          imageAlign: 'left',
          title: 'Open Source'
        }
      ]}
    </Block>
  </React.Fragment>
)

const ArtistShowcase = props => {
  if ((siteConfig.users || []).length === 0) {
    return null
  }
  const showcase = siteConfig.users
    .filter(artist => {
      return artist.pinned
    })
    .map((artist, i) => {
      return (
        <a href={artist.url} key={i}>
          {artist.name}
        </a>
      )
    })

  return (
    <div className='productShowcaseSection paddingBottom'>
      <h2>{'Featured Artists'}</h2>
      <p>We'd like to thank the following artists for letting us use their songs in the game.</p>
      <div className='logos'>{showcase}</div>
      <div className='more-users'>
        <a className='button' href={pageUrl('music.html', props.language)}>
          More Artists
        </a>
      </div>
    </div>
  )
}

class Index extends React.Component {
  render () {
    let language = this.props.language || ''

    return (
      <div>
        <HomeSplash language={language} />
        <div className='mainContainer'>
          <FeatureTour />
          <ArtistShowcase />
          <FooterButtons />
        </div>
      </div>
    )
  }
}

module.exports = Index
