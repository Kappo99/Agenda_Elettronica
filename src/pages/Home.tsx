import React, { useState } from "react";
import Anagrafiche from "../components/Anagrafiche";
import Famiglie from "../components/Famiglie";

function Home() {
  const [isFamiglie, setIsFamiglie] = useState(true);

  return (
    <>
      <div className="container mb-4">
        <button className="btn mx-auto" onClick={() => setIsFamiglie(!isFamiglie)}>Cambia visualizzazione famiglie / anagrafiche</button>
      </div>
      
      {isFamiglie ? <Famiglie /> : <Anagrafiche />}
    </>
  );
}

export default Home;
