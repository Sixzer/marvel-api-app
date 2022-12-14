import { useEffect, useState } from 'react';

import './randomChar.scss';

import mjolnir from '../../resources/img/mjolnir.png';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const RandomChar = () => {

    const [char, setChar] = useState({});

    const {loading, error, getSingleCharacter, clearError} = useMarvelService();


    useEffect(()=>{
        updateChar();
    },[])

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => { 
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getSingleCharacter(id).then(onCharLoaded);
    }

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? <View char={char}/> : null;
    
    return (
        <div className="randomchar">
            {errorMessage}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main" onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}
const View = ({char}) => {
    const {name, descripton, thumbnail, homepage, wiki} = char;
    
    const IMAGE_NOT_FOUND = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
    const IMAGE_NOT_AVAILIBLE = 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif';
    let imgFit = (thumbnail === IMAGE_NOT_FOUND) || (thumbnail === IMAGE_NOT_AVAILIBLE) ? {objectFit: 'fill'} : {objectFit: 'cover'};

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgFit}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">{descripton}</p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">Homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;