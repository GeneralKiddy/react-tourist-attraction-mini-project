import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { DebounceInput } from "react-debounce-input";

function App() {
  const [tripInfo, setTripInfo] = useState([])
  const [query, setQuery] = useState("");

  const handleQueryChange = (event) => { setQuery(event.target.value) };
  const handleTagClick = (tag) => { setQuery(tag) };
  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    alert('Copied to clipboard!');
  };

  useEffect(() => { 
    if (query !== "" ) { getTripInfo(query) } 
    else { setTripInfo([]) }
  }, [query]);

  const getTripInfo = async (searchText) => {
    const result = await axios.get(`http://localhost:4001/trips?keywords=${searchText}`);
    setTripInfo(result.data.data);
  };

  return (
  <div className="App">
    <h1>เที่ยวไหนดี</h1>
    <div className="search-box">
      <DebounceInput
        minLength={2}
        debounceTimeout={500}
        type="text"
        value={query}
        onChange={handleQueryChange}
      />
    </div>
    <div className="trip-lists">
      <ul>
        {tripInfo.map((trip, index) => (
          <li key={index}>
            <div className="trip-image">
              {trip.photos.map((photo, idx) =>
                <img key={idx} width="100" height="100" src={photo}/>
              )}
            </div>
            <div className="trip-info">
              <h2>
                <a href={trip.url} target="_blank" rel="noopener noreferrer">
                  {trip.title}
                </a>
              </h2>
              <p className="description">{trip.description}</p>
              <p className="tags">
                หมวด
                {trip.tags.map((tag, idx) => (
                  <button key={idx} onClick={() => handleTagClick(tag)} className="tag-button">
                    {tag}
                  </button>
                ))}
              </p>
            </div>
            <button onClick={() => handleCopy(trip.url)}>Copy Link</button>
          </li>
        ))}
      </ul>
    </div>

  </div>
  );
}

export default App;
