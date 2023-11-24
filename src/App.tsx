// src/App.tsx
import React, { useEffect, useState } from "react";
import ContributionGraph from "./components/ContributionGraph/ContributionGraph";
import axios from "axios";

interface ContributionData {
  [date: string]: number;
}

const App: React.FC = () => {
  const [contributionData, setContributionData] = useState<ContributionData>(
    {}
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://dpg.gg/test/calendar.json");
        setContributionData(response.data);
      } catch (error) {
        console.error("Error fetching contribution data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app">
      <ContributionGraph data={contributionData} />
    </div>
  );
};

export default App;
