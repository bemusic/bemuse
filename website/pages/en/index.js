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

function pageUrl (page, language) {
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
        <Logo img_src={imgUrl('logo.png')} />
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

const BMSMode = props => (
  <Block background='light'>
    {[
      {
        content: `You can play using an [IIDX controller](https://www.youtube.com/watch?v=EOgI37Myqvk) or [MIDI controller](https://www.facebook.com/bemusegame/videos/985712734835136/).`,
        image: imgUrl('screenshots/gameplay-bms.jpg'),
        imageAlign: 'right',
        title: 'BMS Mode'
      }
    ]}
  </Block>
)

const KeyboardMode = props => (
  <Block>
    {[
      {
        content: 'Play along the music with your keyboard.',
        image: imgUrl('screenshots/gameplay-kbd.jpg'),
        imageAlign: 'left',
        title: 'Keyboard Mode'
      }
    ]}
  </Block>
)

const LearnHow = props => (
  <Block background='light'>
    {[
      {
        content: 'TODO: Custom server setup',
        image: imgUrl('screenshots/music-select.jpg'),
        imageAlign: 'right',
        title: 'Custom Servers'
      }
    ]}
  </Block>
)

const TryOut = props => (
  <Block id='try'>
    {[
      {
        content: `Bemuse is free and open source (licensed under [AGPLv3](https://github.com/bemusic/bemuse/blob/master/LICENSE)).\n\nContributing is also easy! Read through our [developer documentation](${docUrl('developers-getting-started.html')}) for more info.`,
        image: imgUrl('screenshots/oss.png'),
        imageAlign: 'left',
        title: 'Open Source'
      }
    ]}
  </Block>
)

class Index extends React.Component {
  render () {
    let language = this.props.language || ''

    return (
      <div>
        <HomeSplash language={language} />
        <div className='mainContainer'>
          <Features />
          <FeatureCallout />
          <BMSMode />
          <KeyboardMode />
          <LearnHow />
          <TryOut />
          <FooterButtons />
        </div>
      </div>
    )
  }
}

module.exports = Index
