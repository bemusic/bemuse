
import Page, { Heading } from './Page'

export const HomePage = () => {
  return (
    <Page>
      <Heading>What is Bemuse?</Heading>
      <p>
        Bemuse is an online, web-based rhythm game.
      </p>
      <p>
        You play this game by pressing the correct keys on the keyboard along with the music.
        The more accurately you recreate the music, the higher score you get!
        There are more than 40 songs for you to choose from various genres.
      </p>
      <p>
        Compete for the highest score with our online ranking system.
        Play with your friends with our <a href="https://www.youtube.com/watch?v=hiJzFRIhiiA" target="_blank">party mode</a>.
      </p>
      <p>
        Plug in your headphone, connect your <a href="https://www.youtube.com/watch?v=EOgI37Myqvk" target="_blank">game controller</a> or <a href="https://twitter.com/bemusegame/status/673094391905435648" target="_blank">MIDI keyboard</a> and enjoy Bemuse more intensely!
      </p>
      <p>
        As a web-based game,
        you can play this game on any operating system that runs the latest version of Google Chrome.
        No extra software or plugins to install.
      </p>
    </Page>
  )
}

export default HomePage
