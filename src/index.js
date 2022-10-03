import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import MarverService from './services/MarvelService.js'

import './style/style.scss';

const marvelSer = new MarverService();

marvelSer.getAllCharacters().then(res => res.data.results.forEach(element => {
  return console.log(element.name);
}));
marvelSer.getSingleCharacter(1011052).then(res => console.log(res));

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

