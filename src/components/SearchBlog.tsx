import * as React from 'react';
import { useState } from 'react';
import { Search } from 'carbon-components-react';
import { useHistory } from 'react-router-dom';

export default function BlogList() {
  const history = useHistory();
  const [searchInput, setSearchInput] = useState('');

  const handleChange = ({ target }) => {
    setSearchInput(target.value);
  }

  const search = (title) => history.push(`/blogList/${title}`)

  return (
    <form
      data-testid="search-form"
      onSubmit={e => {
        e.preventDefault();
        search(searchInput);
        setSearchInput('');
      }}
    >
      <Search
        id="search-1"
        placeHolderText="Search blogs by title"
        labelText="search"
        type="search"
        data-testid="search-input"
        onChange={handleChange}
        value={searchInput}
      />
    </form>
  );
}