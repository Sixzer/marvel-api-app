import { useState, useEffect } from 'react';
import setContent from '../../utils/setContent';

import './charInfo.scss';
import useMarvelService from '../../services/MarvelService';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);

    const {getSingleCharacter, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId]);

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }
        
        clearError();
        getSingleCharacter(charId).then(onCharLoaded).then(() => setProcess('confirmed'));
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;

    const IMAGE_NOT_FOUND = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
    const IMAGE_NOT_AVAILIBLE = 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif';
    let imgFit = (thumbnail === IMAGE_NOT_FOUND) || (thumbnail === IMAGE_NOT_AVAILIBLE) ? {objectFit: 'fill'} : {objectFit: 'cover'};

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgFit}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">{description}</div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : `There is no comics for this character`}
                {
                    comics.map((item, i)=>{
                        if (i > 9) {
                            return;
                        }
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

export default CharInfo;