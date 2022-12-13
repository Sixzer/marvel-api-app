import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

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



    const _transformChar = (char) => {

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

    return {loading, error, getAllCharacters, getSingleCharacter, clearError}
}

export default useMarvelService;