import './AboutScene.scss'

import React, { useContext, useEffect, useState } from 'react'

import Scene from 'bemuse/ui/Scene'
import SceneHeading from 'bemuse/ui/SceneHeading'
import { SceneManagerContext } from 'bemuse/scene-manager'
import SceneToolbar from 'bemuse/ui/SceneToolbar'

const Artists = ({ artists }: { artists: { name: string; url: string }[] }) => {
  if (artists.length === 0) {
    return <span>loading...</span>
  }
  return (
    <>
      {artists.map((artist, index) => {
        return [
          index ? ', ' : '',
          <a key={artist.name} href={artist.url}>
            {artist.name}
          </a>,
        ]
      })}
    </>
  )
}

const AboutScene = () => {
  const sceneManager = useContext(SceneManagerContext)

  const [artists, setArtists] = useState<{ name: string; url: string }[]>([])
  useEffect(() => {
    fetch('/music/artists.json')
      .then((res) => res.json())
      .then(setArtists)
      .catch((err) => console.error(err))
  }, [])

  const handleBack = () => {
    sceneManager.pop()
  }

  return (
    <Scene className='AboutScene'>
      <SceneHeading>About</SceneHeading>
      <section>
        <article>
          <div className='AboutSceneのlogo'>
            <img src='/res/logo.png' alt='Bemuse' />
          </div>
          <p>
            Bemuse is a web-based rhythm game, a BMS player. The gameplay is
            heavily inspired and influenced by Lunatic Rave 2, beatmaniaIIDX,
            and O2Jam.
          </p>
          <p>
            Bemuse is created because current mainstream BMS players are only
            for Windows, and I use a Mac and Chrome OS. We think it would be a
            good idea to have a cross-platform BMS player. It is also created to
            demonstrate the power of modern web technologies.
          </p>
          <p>
            Bemuse is a free and open source game and is licensed under GNU
            Affero General Public License, version 3. The source code is
            available on <a href='https://github.com/bemusic/bemuse'>GitHub</a>.
          </p>
          <div className='AboutSceneのdjbm'>
            <img src={require('./about-scene/DJBM.png')} alt='DJ Bemuse' />
          </div>
        </article>
        <article>
          <h2>Credits and Acknowledgements</h2>
          <strong>Development Team</strong>
          <ul className='AboutSceneのteamList'>
            <li>
              <a href='https://github.com/dtinth'>@dtinth</a> (Thai
              Pangsakulyanont)
            </li>
            <li>
              <a href='https://github.com/Nachanok'>@Nachanok</a> (Nachanok
              Suktarachan)
            </li>
          </ul>

          <strong>Project Advisor</strong>
          <ul className='AboutSceneのteamList'>
            <li>
              <a href='https://github.com/jittat'>@jittat</a> (Asst.Prof.Dr.
              Jittat Fakcharoenphol)
            </li>
          </ul>

          <p>
            This project is part of the{' '}
            <em>innovative software group project</em> course, part of a
            curriculum in Software and Knowledge Engineering, Department of
            Computer Enginnering, Faculty of Engineering, Kasetsart University,
            Thailand.
          </p>

          <p>
            We'd like to thank{' '}
            <a href='https://hitkey.nekokan.dyndns.info/'>hitkey</a> for
            providing us with a comprehensive reference on the BMS file format
            and for giving us suggestions. We'd also like to thank the following
            artists for letting us use their songs in the game:{' '}
            <Artists artists={artists} />.
          </p>

          <p>
            <strong>Powered by open-source.</strong> Bemuse relies on many open
            source projects for development to make this possible.
          </p>
          <ul>
            <li>
              We use <a href='https://www.pixijs.com/'>Pixi.js</a>, which
              provides a super-fast graphics engine.
            </li>
            <li>
              We use <a href='https://facebook.github.io/react/'>React</a>, a
              library for building modular and composable user interfaces. React
              helps us build the UI more quickly than with traditional HTML and
              CSS.
            </li>
            <li>
              We use <a href='https://webpack.github.io/'>Webpack</a>, which
              efficiently packages the source code modules, assets, and
              libraries we use into standalone web packages.
            </li>
            <li>
              We use <a href='https://www.typescriptlang.org/'>TypeScript</a> to
              statically check our code for type errors and compiles the code
              down to JavaScript.
            </li>
            <li>
              We use{' '}
              <a href='https://www.npmjs.com/package/node-sass'>node-sass</a> to
              be able to write our CSS more efficiently.
            </li>
            <li>
              We use <a href='https://gulpjs.com/'>Gulp</a> to help automate our
              workflow.
            </li>
            <li>
              And we use a lot more, which you can find on{' '}
              <a href='https://david-dm.org/bemusic/bemuse'>david-dm</a>.
            </li>
          </ul>

          <p>
            We would also like to thank these services for letting us use them
            for free:
          </p>
          <ul>
            <li>
              <a href='https://pages.github.com/'>GitHub Pages</a> provides free
              hosting for this project.
            </li>
            <li>
              <a href='https://github.com/'>GitHub</a> hosts our source code
              repository.
            </li>
            <li>
              <a href='https://circleci.com/'>CircleCI</a> continuously runs our
              automated tests and notifies us when our new code breaks existing
              features. CircleCI also builds and deploys new version of the game
              automatically for us.
            </li>
          </ul>
        </article>
      </section>
      <SceneToolbar>
        <a onClick={handleBack}>Back</a>
      </SceneToolbar>
    </Scene>
  )
}

export default AboutScene
