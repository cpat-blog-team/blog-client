import * as React from 'react';
import { useState } from 'react';

export default function BlogList({ search }) {

  const [searchInput, setSearchInput] = useState('');

  const handleChange = ({ target }) => {
    setSearchInput(target.value);
  }

  return (
    <form
      className="search-bar"
      onSubmit={e => {
        e.preventDefault();
        search(searchInput);
        setSearchInput('');
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
        placeholder="search for title"
        data-testid="search-input"
        onChange={handleChange}
        value={searchInput}
      ></input>
    </form>
  );
}