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
  <Block layout='fourColumn'>
    {[
      {
        content: 'Spanning multiple genres, instantly on your browser.',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'top',
        title: '50+ Songs'
      },
      {
        content: 'Play directly from your browser. No extra plugins required.',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'top',
        title: 'Web-based'
      }
    ]}
  </Block>
)

const FeatureCallout = props => (
  <div
    className='productShowcaseSection paddingBottom'
    style={{ textAlign: 'center' }}
  >
    <h2>Main feature TODO</h2>
    <MarkdownBlock>
      {'Brief description of the game TODO'}
    </MarkdownBlock>
  </div>
)

const LearnHow = props => (
  <Block background='light'>
    {[
      {
        content: 'Talk about learning how to use this',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'right',
        title: 'Learn How'
      }
    ]}
  </Block>
)

const TryOut = props => (
  <Block id='try'>
    {[
      {
        content: 'Talk about trying this out',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'left',
        title: 'Try it Out'
      }
    ]}
  </Block>
)

const Description = props => (
  <Block background='dark'>
    {[
      {
        content: 'This is another description of how this project is useful',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'right',
        title: 'Description'
      }
    ]}
  </Block>
)

const Showcase = props => {
  if ((siteConfig.users || []).length === 0) {
    return null
  }
  const showcase = siteConfig.users
    .filter(user => {
      return user.pinned
    })
    .map((user, i) => {
      return (
        <a href={user.infoLink} key={i}>
          <img src={user.image} title={user.caption} />
        </a>
      )
    })

  return (
    <div className='productShowcaseSection paddingBottom'>
      <h2>{"Who's Using This?"}</h2>
      <p>This project is used by all these people</p>
      <div className='logos'>{showcase}</div>
      <div className='more-users'>
        <a className='button' href={pageUrl('users.html', props.language)}>
          More {siteConfig.title} Users
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
          <Features />
          <FeatureCallout />
          <Description />
          <LearnHow />
          <TryOut />
        </div>
      </div>
    )
  }
}

module.exports = Index
