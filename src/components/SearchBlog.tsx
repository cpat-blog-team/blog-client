import * as React from 'react';
import { useState } from 'react';

export default function BlogList({ search }) {

  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    search(searchInput);
    setSearchInput('');
  }

  const handleChange = ({ target }) => {
    setSearchInput(target.value);
  }

  return (
    <form
      className="search-bar"
      onSubmit={e => {
        e.preventDefault();
        handleSearch();
      }}
    >
      <button
        type="submit"
        className="btn btn-primary"
        data-testid="search-button"
      >Search</button>
      <input
        className="form-control search-blog"
        type="search"
        data-testid="search-input"
        onChange={handleChange}
        value={searchInput}
      ></input>
    </form>
  );
}