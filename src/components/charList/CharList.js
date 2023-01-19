import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const setContent = (process, Component, reloading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
        case 'loading':
            return reloading ? <Component/> : <Spinner/>;
        case 'confirmed':
            return <Component/>;
        case 'error':
            return <ErrorMessage />;
        default:
            throw new Error('Unexpected error');
    }
}

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [reloading, setReloading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    
    const {getAllCharacters, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setReloading(false) : setReloading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded).then(setProcess('confirmed'));
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9) {
            ended = true;
        }

        setCharList((charList) => [...charList, ...newCharList]);
        setReloading(false);
        setOffset((offset) => offset + 9);
        setCharEnded(ended);
    }

    const itemRefs = useRef([]);

    const itemFocus = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            const IMAGE_NOT_FOUND = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
            const IMAGE_NOT_AVAILIBLE = 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif';
            let imgFit = (item.thumbnail === IMAGE_NOT_FOUND) || (item.thumbnail === IMAGE_NOT_AVAILIBLE) ? {objectFit: 'fill'} : {objectFit: 'cover'};
            
            return (
                <li 
                className="char__item"
                tabIndex={0}
                ref={el => itemRefs.current[i] = el}
                key={item.id} 
                onClick={() => {
                    props.onCharSelected(item.id);
                    itemFocus(i);
                }}
                onKeyPress = {(e) => {
                    if (e.key === ' ' || e.key === "Enter") {
                        props.onCharSelected(item.id);
                        itemFocus(i);
                    }
                }}>
                        <img src={item.thumbnail} alt={item.name} style={imgFit}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
    
    return (
        <div className="char__list">
            {setContent(process, () => renderItems(charList), reloading)}
            <button 
                className="button button__main button__long" 
                disabled={reloading}
                style={{display: charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}

export default CharList;