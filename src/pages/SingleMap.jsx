import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { env } from "../config";

const SingleMap = () => {
  const { key } = useParams();
  const [map, setMap] = useState(null);

  useEffect(() => {
    axios.get(`${env.baseUrl}/api/single-map/${key}`)
      .then(res => setMap(res.data.map))
      .catch(err => console.error(err));
  }, [key]);

  if (!map) return <div />;

  return (
    <div>
      <section className="inner-banner">
        <div className="container">
          <div className="text-block">
            <h1><em>{map.title}</em></h1>
          </div>
        </div>
      </section>

      <div className="container mt-4">
        <div dangerouslySetInnerHTML={{ __html: map.mapiframe }} />
      </div>
    </div>
  );
};

export default SingleMap;
