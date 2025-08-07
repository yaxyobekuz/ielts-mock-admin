import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="py-28">
      <div className="container">
        <Link to="/tests/test/testId/preview/listening/1">Edit</Link>
      </div>
    </div>
  );
};

export default Home;
