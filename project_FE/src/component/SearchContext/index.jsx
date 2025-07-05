import { createContext, useState } from 'react';
import { searchReview } from "../../serviceAPI/reviewService"

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [categories, setCategories] = useState()

  const [loadingSearch, setLoadingSearch] = useState(false);

  const [isSearch, setIsSearch] = useState(false)

  const handleSearch = async (term, selectedCategories) => {

    setIsSearch(true);

    if (!term.trim() && selectedCategories.length === 0) {
      setIsSearch(false)
      setSearchResults([]);
      return;
    } 

    setSearchTerm(term);
    setCategories(selectedCategories)

    console.log(term, selectedCategories)

    try {
      setLoadingSearch(true)

        const resultPurposes = await searchReview(term, selectedCategories)
        
        if (resultPurposes.data.status == "Success") {
          setSearchResults(resultPurposes.data.data)
        } else {
          setSearchResults([])
        }
      
    } catch (error) {
      console.error("Có lỗi xảy ra khi gọi api review:", error)
      setSearchResults([])
    } finally {
      setLoadingSearch(false)
    }
  };

  return (
    <SearchContext.Provider
      value={{ searchTerm, searchResults, handleSearch, loadingSearch, isSearch, categories }}
    >
      {children}
    </SearchContext.Provider>
  );
};