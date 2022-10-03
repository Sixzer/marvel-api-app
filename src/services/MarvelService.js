

class MarvelService {

    _apiBase = `https://gateway.marvel.com:443/v1/public/`;
    _apiKey = `apikey=58bf4eccd853db833404e06be0711dcd`;

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Coudnt fetch ${url}, status: ${res.status}`)
        }
        return res.json();
    }

    getAllCharacters = () => {
        return this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
    }

    getSingleCharacter = (id) => {
        return this.getResource(`${this._apiBase}characters/${id}?&${this._apiKey}`);
    }
}

export default MarvelService;