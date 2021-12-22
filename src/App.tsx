import { useState } from "react";
import styles from "./App.module.css";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import UserData from "./components/UserData";

const httpLink = createHttpLink({
  uri: "https://api.github.com/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("REACT_APP_GITHUB_TOKEN");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const [repositoriesNumber, setRepositoriesNumber] = useState("5");
  const [githubId, setGithubId] = useState("");
  const [dataOrder, setDataOrder] = useState("DESC");
  return (
    <div>
      <label htmlFor="githubId" className={styles.idArea}>
        ID:
        <input
          type="text"
          onChange={(event) => setGithubId(event.target.value)}
          value={githubId}
        />
        ;
      </label>
      Get
      <label className={styles.selectArea}>
        <select
          onChange={(event) => setDataOrder(event.target.value)}
          value={dataOrder}
        >
          <option value={"DESC"}>newer</option>
          <option value={"ASC"}>older</option>
        </select>
      </label>
      <label htmlFor="repositoriesNumber" className={styles.selectArea}>
        <select
          onChange={(event) => setRepositoriesNumber(event.target.value)}
          value={repositoriesNumber}
        >
          <option value={"5"}>5</option>
          <option value={"10"}>10</option>
          <option value={"15"}>15</option>
          <option value={"20"}>20</option>
        </select>
      </label>
      repositories
      {githubId ? (
        <ApolloProvider client={client}>
          <UserData
            repositoriesNumber={repositoriesNumber}
            githubId={githubId}
            dataOrder={dataOrder}
          />
        </ApolloProvider>
      ) : (
        <div className={styles.errorText}>Please input ID!</div>
      )}
    </div>
  );
}

export default App;
