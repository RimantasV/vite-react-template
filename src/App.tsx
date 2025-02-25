import { useState } from 'react';
import * as reactRouterDom from 'react-router-dom';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import SuperTokens, { SuperTokensWrapper } from 'supertokens-auth-react';
import { SessionAuth } from 'supertokens-auth-react/recipe/session';
import { getSuperTokensRoutesForReactRouterDom } from 'supertokens-auth-react/ui';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { Root } from './components/Root';
import { SplashScreen } from './components/SplashScreen';
import {
  // ComponentWrapper,
  PreBuiltUIList,
  SuperTokensConfig,
} from './config/config';
import {
  Admin,
  Dictionary,
  FindLyrics,
  Home,
  LanguageSelect,
  Learn,
  List,
  Lists,
  Movie,
  MoviesAndTV,
  MultiSelect,
  Music,
  Quiz,
  QuizMovie,
  Reader,
  ReviewClips,
  ReviewSongs,
  Settings,
  Song,
  Subtitles,
  Test,
  Test2,
  VocabularyLevel,
} from './pages';

// import { useUserSettingsQuery } from './queries';
import './App.css';

// import { ThirdPartyPreBuiltUI } from 'supertokens-auth-react/recipe/thirdparty/prebuiltui';
// import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui';

SuperTokens.init(SuperTokensConfig);

function App() {
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  if (showSplashScreen) {
    return (
      <SessionAuth requireAuth={false}>
        <SplashScreen setSplashScreenState={setShowSplashScreen} />;
      </SessionAuth>
    );
  }

  return (
    <SuperTokensWrapper>
      {/* <ComponentWrapper> */}
      <div className='App app-container'>
        <Router>
          <Routes>
            {/* This shows the login UI on "/auth" route */}
            {getSuperTokensRoutesForReactRouterDom(
              reactRouterDom,
              PreBuiltUIList,
            )}
            <Route
              path='/'
              element={
                /* This protects the "/" route so that it shows
                          <Home /> only if the user is logged in.
                          Else it redirects the user to "/auth" */
                <SessionAuth>
                  <Root />
                </SessionAuth>
              }
            >
              <Route index element={<Home />} />
              <Route path='/admin' element={<Admin />} />
              <Route path='/lists' element={<Lists />} />
              <Route path='/learn' element={<Learn />} />
              <Route path='/lists/:id' element={<List />} />
              <Route path='/dictionary' element={<Dictionary />} />
              <Route path='/movies-and-tv' element={<MoviesAndTV />} />
              <Route path='/movies-and-tv/:id' element={<Movie />} />
              <Route path='/movie/:id' element={<MultiSelect />} />
              <Route path='/subtitles' element={<Subtitles />} />
              <Route path='/settings' element={<Settings />} />
              <Route
                path='/settings/vocabulary-level'
                element={<VocabularyLevel />}
              />
              <Route path='/test' element={<Test />} />
              <Route path='/test2' element={<Test2 />} />
              <Route path='/reader' element={<Reader />} />
              <Route path='/music' element={<Music />} />
              <Route path='/music/song' element={<Song />} />
              <Route path='/admin/find-lyrics' element={<FindLyrics />} />
              <Route path='/admin/review-clips' element={<ReviewClips />} />
              <Route path='/admin/review-songs' element={<ReviewSongs />} />
            </Route>
            <Route
              path='/quiz'
              element={
                <SessionAuth>
                  <Quiz />
                </SessionAuth>
              }
            />
            <Route path='/quiz-movie' element={<QuizMovie />} />
            <Route path='/select-language' element={<LanguageSelect />} />
          </Routes>
        </Router>
      </div>
      {/* </ComponentWrapper> */}
    </SuperTokensWrapper>
  );
}

export default App;
