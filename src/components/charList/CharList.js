import React, {useState,useEffect,useRef} from 'react';
import Spinner from '../spiner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [charListOffset, setCharListOffset] = useState(210);
    const [charListEnded, setCharListEnded] = useState(false);
    
    const marvelService = new MarvelService();

    let onRequest = (offset) => {
        onCharListLoading()
        marvelService.getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError)
    }

    useEffect(() => {
        onRequest();
    },[]) 

    let onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList < 9) {
            ended = true
        }

        setCharList(charlist => [...charList, ...newCharList]);
        setLoading(false);
        setNewItemLoading(false);
        setCharListOffset(charListOffset => charListOffset + 9);
        setCharListEnded(ended);
    }

    let onCharListLoading = () => {
        setNewItemLoading(true)
    }

    let onError = () => {
        setError(true);
        setLoading(false);
    }

    const itemRefs = useRef([]);

    let focusOnItem = (id) => {
        itemRefs.current.forEach(item => {
            item.classList.remove('char__item_selected')
        })
        itemRefs.current[id].classList.add('char__item_selected')
        itemRefs.current[id].focus()
    }

    function renderItems(arr) {
        const items =  arr.map((item,i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    ref = {el => itemRefs.current[i] = el}
                    onClick={() => {
                        props.updateCharId(item.id)
                        focusOnItem(i)
                        }}
                    className='char__item'
                    key={item.id}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
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

    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button 
                style={{'display': charListEnded ? 'none' : 'block'}}
                onClick={() => onRequest(charListOffset)} 
                className="button button__main button__long"
                disabled={newItemLoading}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
    
}

export default CharList;