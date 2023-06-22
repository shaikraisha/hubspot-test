import React from "react";
import "./App.scss";
import axios from "axios";
import FuzzySearch from "react-fuzzy";

const GenreDropdownData = [
  "ACTION",
  "ADVENTURE",
  "ANIMATION",
  "BIOGRAPHY",
  "CLASSICS",
  "COMEDY",
  "CRIME",
];
const YearDropdownData = [
  "1870",
  "1892",
  "1895",
  "1863",
  "1871",
  "1873",
  "1874",
];
export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newSearchValue: {
        selectedGenre: [],
        selectedYear: [],
        selectedRadioType: "",
        searchValue: "",
      },
      genreClicked: false,
      yearClicked: false,
      data: [],
      filteredData: [],
      error: null,
    };
  }

  componentDidMount() {
    axios
      .get(
        "https://raw.githubusercontent.com/HubSpotWebTeam/CodeExercise/main/src/js/data/data.json"
      )
      .then(
        (results) => {
          this.setState(
            {
              data: results.data.media,
              filteredData: results.data.media,
            },
            () => {
              this.onSortEnd();
            }
          );
        },
        (error) => {
          this.setState({ isLoaded: false, error });
        }
      );
  }
  handleClearFilter = () => {
    console.log("atttt filter called");
    this.setState({
      newSearchValue: {
        selectedGenre: [],
        selectedYear: [],
        selectedRadioType: null,
        searchValue: "",
      },
      filteredData: this.state.data,
    });
  };

  getFilteredData = () => {
    const { data, newSearchValue } = this.state;
    let filteredData = "";

    //Genre filter new
    if (newSearchValue.selectedGenre.length > 0) {
      newSearchValue.selectedGenre.forEach((selectedValue) => {
        const tempData = data.filter((item) =>
          item.genre.includes(selectedValue)
        );
        filteredData = [...filteredData, ...tempData];
      });
    }

    //Year filter
    if (newSearchValue.selectedYear.length > 0) {
      newSearchValue.selectedYear.forEach((selectedValue) => {
        const tempData = data.filter((item) =>
          item.year.includes(selectedValue)
        );
        filteredData = [...filteredData, ...tempData];
      });
    }

    //radio filter
    if (newSearchValue.selectedRadioType != null) {
      const Filterobject = filteredData == "" ? data : filteredData;

      let radioFilteredData = Filterobject.filter((item) =>
        item.type.includes(newSearchValue.selectedRadioType)
      );
      filteredData = radioFilteredData;
    }
    //Search filter
    if (newSearchValue.searchValue != "") {
      const Filterobject = filteredData == "" ? data : filteredData;
      filteredData = Filterobject.filter(({ title }) => {
        const str = title.toLowerCase();
        const temp = newSearchValue.searchValue;
        return str.includes(temp.toLowerCase());
      });
    }

    //setStatus
    filteredData = filteredData == "" ? data : filteredData;
    this.setState({ filteredData }, () => {
      this.onSortEnd();
    });
  };

  genreDropdownChange = (e) => {
    console.log("qqqq=", e.target.checked);
    if (e.target.checked) {
      Promise.resolve(
        this.setState({
          newSearchValue: {
            ...this.state.newSearchValue,
            selectedGenre: [
              ...this.state.newSearchValue.selectedGenre,
              e.target.value,
            ],
          },
        })
      ).then(() => this.getFilteredData());
    } else {
      let tempArr = this.state.newSearchValue.selectedGenre;
      tempArr = tempArr.filter((item) => item != e.target.value);
      console.log("tempArr=", tempArr);
      Promise.resolve(
        this.setState({
          newSearchValue: {
            ...this.state.newSearchValue,
            selectedGenre: tempArr,
          },
        })
      ).then(() => this.getFilteredData());
    }
  };

  yearDropdownChange = (e) => {
    if (e.target.checked) {
      Promise.resolve(
        this.setState({
          newSearchValue: {
            ...this.state.newSearchValue,
            selectedYear: [
              ...this.state.newSearchValue.selectedYear,
              e.target.value,
            ],
          },
        })
      ).then(() => this.getFilteredData());
    } else {
      let tempArr = this.state.newSearchValue.selectedYear;
      tempArr = tempArr.filter((item) => item != e.target.value);
      Promise.resolve(
        this.setState({
          newSearchValue: {
            ...this.state.newSearchValue,
            selectedYear: tempArr,
          },
        })
      ).then(() => this.getFilteredData());
    }
  };

  handleRadioChange = (e) => {
    console.log("e=", e.target);
    Promise.resolve(
      this.setState({
        newSearchValue: {
          ...this.state.newSearchValue,
          selectedRadioType: e.target.value,
        },
      })
    ).then(() => this.getFilteredData());
  };

  handleSearch = (e) => {
    console.log("e=", e.target);
    //fuzzy search
    // this.setState(
    //   {
    //     newSearchValue: {
    //       ...this.state.newSearchValue,
    //       searchValue: e.title,
    //     },
    //   },
    //   () => this.getFilteredData()
    // );

    //normal search
    this.setState(
      {
        newSearchValue: {
          ...this.state.newSearchValue,
          searchValue: e.target.value,
        },
      },
      () => this.getFilteredData()
    );
  };

  showCheckboxes = (e) => {
    console.log("ali", e.target);
    if (e.target.id === "genreDropdown") {
      if (this.state.genreClicked) {
        this.setState({
          genreClicked: false,
        });
      } else {
        this.setState({
          genreClicked: true,
        });
      }
    } else {
      if (this.state.yearClicked) {
        this.setState({
          yearClicked: false,
        });
      } else {
        this.setState({
          yearClicked: true,
        });
      }
    }
  };

  onSortEnd = () => {
    const { filteredData } = this.state;
    filteredData.sort(function (a, b) {
      var textA = a.title.toUpperCase();
      var textB = b.title.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    this.setState({ filteredData });
  };

  handleCheckboxStatus = (e) => {
    console.log("e.target=", e.target);
    const value = e.target.value;
    const { newSearchValue } = this.state;
    console.log("aaaq newSearchValue=", newSearchValue);
    newSearchValue.selectedGenre.forEach((selectedValue) => {
      console.log("aaaq=", selectedValue);
      //  data.filter((item) =>
      //     item.genre.includes(selectedValue)
      //   );
    });
    if (e.target.checked) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    console.log(
      "filteredData=",
      this.state.filteredData,
      this.state.newSearchValue
    );
    const { newSearchValue } = this.state;
    return (
      <div className="main-page">
        <div className="filter-container">
          <div className="left-filter-item">
            <div>
              <div className="dropdown-container">
                <div className="dropdown-element">
                  <div class="dropdown" onClick={(e) => this.showCheckboxes(e)}>
                    <span id="genreDropdown" class="anchor">
                      {newSearchValue.selectedGenre.length > 0
                        ? newSearchValue.selectedGenre.length
                        : ""}{" "}
                      GENRES
                    </span>
                  </div>
                  {this.state.genreClicked ? (
                    <div
                      className="dropdown-display-list dropdown"
                      onChange={(e) => this.genreDropdownChange(e)}
                    >
                      {console.log("clikced")}
                      <ul class="dropdown-checklist">
                        {GenreDropdownData.map((element) => {
                          return (
                            <li>
                              <input
                                value={element.toLowerCase()}
                                type="checkbox"
                                checked={newSearchValue.selectedGenre.includes(
                                  element.toLowerCase()
                                )}
                                //checked={this.handleCheckboxStatus}
                              />
                              {element}
                            </li>
                          );
                        })}
                        {/* <li>
                          <input value="action" type="checkbox" />
                          ACTION{" "}
                        </li>
                        <li>
                          <input value="adventure" type="checkbox" />
                          ADVENTURE
                        </li>
                        <li>
                          <input value="animation" type="checkbox" />
                          ADVENTURE{" "}
                        </li>
                        <li>
                          <input value="biography" type="checkbox" />
                          BIOGRAPHY{" "}
                        </li>
                        <li>
                          <input value="classics" type="checkbox" />
                          CLASSICS{" "}
                        </li>
                        <li>
                          <input value="comedy" type="checkbox" />
                          COMEDY{" "}
                        </li>
                        <li>
                          <input value="crime" type="checkbox" />
                          CRIME
                        </li>*/}
                      </ul>
                    </div>
                  ) : null}
                </div>
                <div className="dropdown-element">
                  <div class="dropdown" onClick={(e) => this.showCheckboxes(e)}>
                    <span id="yearDropdown" class="anchor">
                      YEAR
                    </span>
                  </div>
                  {this.state.yearClicked ? (
                    <div
                      className="dropdown-display-list dropdown"
                      onChange={(e) => this.yearDropdownChange(e)}
                    >
                      {console.log("clikced")}
                      <ul class="dropdown-checklist">
                        {YearDropdownData.map((element) => {
                          return (
                            <li>
                              <input
                                value={element}
                                type="checkbox"
                                checked={newSearchValue.selectedYear.includes(
                                  element
                                )}
                                //checked={this.handleCheckboxStatus}
                              />
                              {element}
                            </li>
                          );
                        })}
                        <li>
                          <input value="1870" type="checkbox" />
                          1870{" "}
                        </li>
                        <li>
                          <input value="1892" type="checkbox" />
                          1892
                        </li>
                        <li>
                          <input value="1895" type="checkbox" />
                          1895{" "}
                        </li>
                        <li>
                          <input value="1863" type="checkbox" />
                          1863{" "}
                        </li>
                        <li>
                          <input value="1871" type="checkbox" />
                          1871{" "}
                        </li>
                        <li>
                          <input value="1873" type="checkbox" />
                          1873{" "}
                        </li>
                        <li>
                          <input value="1874" type="checkbox" />
                          1874
                        </li>
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="radio-container">
                <form onChange={(e) => this.handleRadioChange(e)}>
                   {" "}
                  <input
                    type="radio"
                    id="movie"
                    name="dataType"
                    value="movie"
                  />
                    <label for="html">Movies</label> {" "}
                  <input type="radio" id="book" name="dataType" value="book" /> {" "}
                  <label for="css">Books</label>
                </form>
              </div>
            </div>
          </div>
          <div className="center-filter-item"></div>
          <div className="right-filter-item">
            <div>
              {/* <div className="dropdown">
              <FuzzySearch
                list={this.state.data}
                keys={["title"]}
                onSelect={(e) => this.handleSearch(e)}
                handleChange={(e) => {
                  this.handleSearchChange(e);
                }}
                verbose={true}
                className={"dropdown"}
              /> */}
              <input
                type="search"
                className="search-filter"
                name="searchValue"
                placeholder="Search..."
                value={newSearchValue.searchValue}
                onChange={(e) => this.handleSearch(e)}
              />
            </div>
            <div>
              <button className="clear-filter" onClick={this.handleClearFilter}>
                CLEAR FILTERS
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div className="grid-container">
          {this.state.filteredData.map((ele) => (
            <div className="grid-item">
              <div className="grid-tile">
                <img
                  src={ele.poster}
                  alt="image1"
                  width="95%"
                  height="100%"
                ></img>
                <div>
                  {ele.title} ({ele.year})
                </div>
                <div>Genres:{ele.genre.toString()}</div>
              </div>
            </div>
          ))}
          <div></div>
        </div>
      </div>
    );
  }
}
