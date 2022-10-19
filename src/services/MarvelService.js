

class MarvelService {

    _apiBase = `https://gateway.marvel.com:443/v1/public/`;
    _apiKey = `apikey=58bf4eccd853db833404e06be0711dcd`;
    _baseOffset = 210;

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Coudnt fetch ${url}, status: ${res.status}`)
        }
        return res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformChar);
    }

    getSingleCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?&${this._apiKey}`);
        return this._transformChar(res.data.results[0]);
    }



    _transformChar = (char) => {

        if (!char.descripton) {
            char.descripton = 'Bio or description of the character is not found.'
        }

        else if (char.descripton.length > 220) {
            char.descripton = `${char.descripton.split("").slice(0,219).join("")}...`;
        }

        return {
            name: char.name,
            id: char.id,
            descripton: char.descripton,
            thumbnail: char.thumbnail.path + `.` + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
}

export default MarvelService;