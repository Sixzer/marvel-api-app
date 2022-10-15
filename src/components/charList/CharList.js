import './charList.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends Component {
    state = { 
        items: [],
        loading: true,
        error: false,
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChars()
        
        //this.timerid = setInterval(this.updateChar,5000);
    }

    onCharLoaded = (items) => {
        this.setState({items, loading: false});
    }

    onError = () => {
        this.setState({loading: false, error: true});
    }

    updateChars = () => { 
        this.marvelService.getAllCharacters().then(this.onCharLoaded).catch(this.onError);
    }

    
    render () {
        const {items, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <HelpMe items={items}/> : null;

        return (
            <div className="char__list">
            <ul className="char__grid">
                {errorMessage}
                {spinner}
                {content}
            </ul>
            <button className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
        )
    }
}

const HelpMe = ({items}) => {
    return items.map(char =>{
        const {name, thumbnail, id} = char;
        const IMAGE_NOT_FOUND = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
        const IMAGE_NOT_AVAILIBLE = 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif';
        let imgFit = thumbnail === (IMAGE_NOT_FOUND || IMAGE_NOT_AVAILIBLE) ? {objectFit: 'fill'} : {objectFit: 'cover'};

        return (
            <li className="char__item char__item_selected" key={id}>
                <img src={thumbnail} alt="abyss" style={imgFit}/>
                <div className="char__name">{name}</div>
            </li>
        )
    });
}

export default CharList;