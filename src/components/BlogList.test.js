import React from "react";
import { render, fireEvent } from "@testing-library/react";
import BlogList from "./BlogList";
import "@testing-library/jest-dom";

describe("BlogList component", () => {
  test("canary test", () => {
    expect(true).toEqual(true);
  });

  test("expect BlogList to render", () => {
    const component = render(<BlogList />);
    expect(component.container).toBeInTheDocument();
  });

  test("expect search bar to clear once blog is searched", () => {
    const component = render(<BlogList />);

    //adds text to search input
    const searchInput = component.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'some blog title' } });

    //clicks search button
    const searchButton = component.getByTestId('search-button');
    fireEvent.click(searchButton);

    expect(searchInput.value).toBe('');
  });
});