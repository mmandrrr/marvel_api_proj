import { useState, useEffect } from 'react';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spiner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import Skeleton from '../skeleton/Skeleton'

import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    
    const marvelService = new MarvelService();

    let onCharLoaded = (char) => {
        setChar(char);
        setLoading(false);
    }

    let onError = () => {
        setLoading(false);
        setError(true);
    }

    let onCharLoading = () => {
       setLoading(true)
    }

    let updateChar = () => {
        const {charId} = props
        if(!charId) {
            return null;
        }

        onCharLoading()
        marvelService.getCharacter(charId)
        .then(onCharLoaded)
        .catch(onError)
    }

    useEffect(() => {
        updateChar()
    },[props.charId])

    const skeleton = char || loading || error ? null : <Skeleton />
    const errorMessage = error ? <ErrorMessage/> : null;
    const load = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char = {char} /> : null

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {load}
            {content}
        </div>
    )
    
}

const View = ({char}) => {
    const {name,description,thumbnail,homepage,wiki,comics} = char
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }
    const comicsList = comics.filter((item,i) => {
        if(i < 10) {
            return item
        }
    })

    return(
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
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
            <div className="char__descr">
                {description ? description : 'There is no description yet :('}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics :('}
                {comicsList.map((item,i) => {
                    return(
                        <li className="char__comics-item" key={i}>
                            {item.name}
                        </li>
                )
            })}
                    </ul>
                </>
            )
}

export default CharInfo;