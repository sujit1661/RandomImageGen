import React, { useState } from "react";
import "./index.css";


/* used to generate random images from picsum.photos*/
function App() {
  const generateSeeds = () =>
    Array.from({ length: 6 }, () => Math.floor(Math.random() * 10000));
  const [seeds, setSeeds] = useState(generateSeeds());

  const refreshImages = () => setSeeds(generateSeeds());
  return (
    <div className="container">
      <div className="left">
        <h1 className="heading">Random Image Generator</h1>
        <p className="tagline">
          Feeling uninspired? Let randomness spark your creativity.
        </p>
        <p className="description">
          Instantly refresh your screen with unique images from around the web.
          No design skills needed — just one click and you're in a new visual world.
        </p>
        <p className="description">
          It's simple, fast, and completely free. Ready to explore?
        </p>
        <button onClick={refreshImages}>Generate Random Images</button>
      </div>


      <div className="right">
        <div className="image-grid">
          {seeds.map((seed, index) => (
            <img
              key={index}
              src={`https://picsum.photos/seed/${seed}/400/400`}
              alt={`Random ${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


export default App;

