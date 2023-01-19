import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {request, clearError, process, setProcess} = useHttp();

    const _apiBase = `https://gateway.marvel.com:443/v1/public/`;
    const _apiKey = `apikey=58bf4eccd853db833404e06be0711dcd`;
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformChar);
    }

    const getSingleCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?&${_apiKey}`);
        return _transformChar(res.data.results[0]);
    }

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getSingleComics = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformChar);
    }

    const _transformChar = (char) => {

        if (!char.description) {
            char.description = 'Bio or description of the character is not found.'
        }

        else if (char.description.length > 220) {
            char.description = `${char.description.split("").slice(0,219).join("")}...`;
        }

        return {
            name: char.name,
            id: char.id,
            description: char.description,
            thumbnail: char.thumbnail.path + `.` + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            language: comics.textObjects.language || 'en-us',
            price: comics.prices.price ? `${comics.prices.price}$` : 'not available',
        }
    }

    return {process, setProcess, getAllCharacters, getSingleCharacter, getAllComics, getSingleComics, getCharacterByName, clearError}
}

export default useMarvelService;