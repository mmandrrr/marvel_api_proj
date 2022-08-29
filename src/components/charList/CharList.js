import React, {Component} from 'react';
import Spinner from '../spiner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading : false,
        charListOffset : 1550,
        charListEnded : false,
    }
    
    marvelService = new MarvelService();

    componentDidMount() {
        this.marvelService.getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onRequest = (offset) => {
        this.onCharListLoading()
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList < 9) {
            ended = true
        }

        this.setState(({charList}) => ({
            charList : [...charList, ...newCharList],
            loading: false,
            newItemLoading : false,
            charListOffset : this.state.charListOffset + 9,
            charListEnded : ended,
        }))
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading : true
        })
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    refItems = [];

    setRef = (ref) => {
        this.refItems.push(ref);
    }

    focusOnItem = (id) => {
        this.refItems.forEach(item => {
            item.classList.remove('char__item_selected')
        })
        this.refItems[id].classList.add('char__item_selected')
        this.refItems[id].focus()
    }

    renderItems(arr) {
        const items =  arr.map((item,i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    ref = {this.setRef}
                    onClick={() => {
                        this.props.updateCharId(item.id)
                        this.focusOnItem(i)
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

    render() {

        const {charList, loading, error,newItemLoading,charListOffset,charListEnded} = this.state;
        
        const items = this.renderItems(charList);

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
                    onClick={() => this.onRequest(charListOffset)} 
                    className="button button__main button__long"
                    disabled={newItemLoading}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;