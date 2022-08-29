

class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=b4b7e9d23df34a62a64ee058ff8d3372';
    _baseOffset = 210;

    getResource = async(url) => {
        let result = await fetch(url);

        if(!result.ok) {
            throw new Error(`Couldn't fetch ${url}`)
        }
        return await result.json()
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const data = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`)
        return data.data.results.map(this._updateCharacter)
    }

    getCharacter = async (id) => {
        const data =  await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._updateCharacter(data.data.results[0])
    }

    _updateCharacter = (char) => {
        return {
            id : char.id,
            name : char.name,
            description : char.description,
            thumbnail : char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage : char.urls[0].url,
            wiki : char.urls[1].url,
            comics : char.comics.items,
        }
    }
}

export default MarvelService