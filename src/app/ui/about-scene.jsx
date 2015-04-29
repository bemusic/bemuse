
import './about-scene.scss'

import $                from 'jquery'
import React            from 'react'
import Scene            from 'bemuse/ui/scene'
import SceneHeading     from 'bemuse/ui/scene-heading'
import SceneToolbar     from 'bemuse/ui/scene-toolbar'
import SCENE_MANAGER    from 'bemuse/scene-manager'

let artists

export default React.createClass({
  getInitialState() {
    return { artists: [] }
  },
  componentDidMount() {
    if (!artists) {
      artists = Promise.resolve($.get('/music/artists.json'))
    }
    artists.then(a => this.setState({ artists: a }))
  },
  render() {
    return <Scene className="about-scene">
      <SceneHeading>
        About
      </SceneHeading>
      <section>
        <article>
          <div className="about-scene--logo">
            <img src="/res/logo.png" alt="Bemuse" />
          </div>
          <p>
            Bemuse is a web-based rhythm game, a BMS player.
            The gameplay is heavily inspired and influenced by Lunatic Rave 2,
            beatmaniaIIDX, and O2Jam.
          </p>
          <p>
            Bemuse is created because current mainstream BMS players
            are only for Windows, and I use a Mac and Chrome OS.
            We think it would be a good idea
            to have a cross-platform BMS player.
            It is also created to demonstrate the power
            of modern web technologies.
          </p>
          <p>
            Bemuse is a free and open source game and is licensed under
            GNU Affero General Public License, version 3.
            The source code is available on <a
                href="https://github.com/bemusic/bemuse">GitHub</a>.
          </p>
        </article>
        <article>

          <h2>Credits and Acknowledgements</h2>
          <strong>Development Team</strong>
          <ul className="about-scene--team-list">
            <li>
              <a href="https://github.com/dtinth">@dtinth</a>
              {' '}(Thai Pangsakulyanont)
            </li>
            <li>
              <a href="https://github.com/Nachanok">@Nachanok</a>
              {' '}(Nachanok Suktarachan)
            </li>
          </ul>

          <strong>Project Advisor</strong>
          <ul className="about-scene--team-list">
            <li>
              <a href="https://github.com/jittat">@jittat</a>
              {' '}(Asst.Prof.Dr. Jittat Fakcharoenphol)
            </li>
          </ul>

          <p>This project is part
          of the <em>innovative software group project</em> course,
          part of a curriculum in Software and Knowledge Engineering,
          Department of Computer Enginnering, Faculty of Engineering,
          Kasetsart University, Thailand.</p>

          <p>We{"'"}d like to thank <a
              href="http://hitkey.nekokan.dyndns.info/">hitkey</a> for
          providing us with a comprehensive reference on the BMS file format
          and for giving us suggestions.
          We{"'"}d also like to thank the following artists
          for letting us use their songs
          in the game: {this.renderArtists()}.</p>

        </article>
      </section>
      <SceneToolbar>
        <a onClick={this.handleBack} href="javascript://">Back</a>
      </SceneToolbar>
    </Scene>
  },
  renderArtists() {
    if (this.state.artists.length === 0) {
      return <span>loading...</span>
    }
    return this.state.artists.map((artist, index) => {
      return [index ? ', ' : '', <a href={artist.url}>{artist.name}</a>]
    })
  },
  handleBack() {
    SCENE_MANAGER.pop().done()
  },
})
