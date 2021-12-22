import { gql, useQuery } from "@apollo/client";
import styles from "./index.module.css";
import dayjs from "dayjs";

type UserDataProps = {
  repositoriesNumber: string;
  githubId: string;
  dataOrder: string;
};

const GET_USER_DATA = gql`
  query getAnyRepositories(
    $count: Int!
    $id: String!
    $dataOrder: OrderDirection!
  ) {
    user(login: $id) {
      login
      name
      location
      email
      url
      avatarUrl
      repositories(
        first: $count
        orderBy: { field: CREATED_AT, direction: $dataOrder }
      ) {
        nodes {
          createdAt
          description
          name
          url
          updatedAt
        }
      }
    }
  }
`;

function UserData({ repositoriesNumber, githubId, dataOrder }: UserDataProps) {
  const { loading, error, data } = useQuery(GET_USER_DATA, {
    variables: {
      count: parseInt(repositoriesNumber, 10),
      id: githubId,
      dataOrder,
    },
  });
  const {
    login,
    name: userName,
    location,
    email,
    url,
    avatarUrl,
    repositories,
  } = data?.user || {}; // 左辺がundifinedになるのを避けるため、 ||{}をつける
  const repositoriesArray = repositories?.nodes;

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.errorText}>{error.message}</p>;

  const repositoriesItem = repositoriesArray.map(
    (
      {
        description,
        name,
        createdAt,
        url,
        updatedAt,
      }: {
        description: string;
        name: string;
        createdAt: string;
        url: string;
        updatedAt: string;
      },
      index: number
    ) => {
      return (
        <div key={name} style={{ paddingLeft: 10, paddingBottom: 10 }}>
          <div>
            {index + 1}. <a href={url}>{name}</a>
          </div>
          <div>
            <span className={styles.title}>Created date</span> :{" "}
            {dayjs(createdAt).format("YYYY/M/D H:mm")}
          </div>
          <div>
            <span className={styles.title}>Updated date</span> :{" "}
            {dayjs(updatedAt).format("YYYY/M/D H:mm")}
          </div>
          <div>
            <span className={styles.title}>description</span>:{" "}
            {description ? description : "none"}
          </div>
        </div>
      );
    }
  );

  return (
    <>
      <h3>
        <a href={url} style={{ textDecoration: "none" }}>
          <img
            src={avatarUrl}
            alt="icon"
            style={{
              width: 20,
              borderRadius: "50%",
            }}
          />
          {userName}
        </a>
        ({login})
      </h3>
      <div>Location: {location ? location : "none"}</div>
      <div>Mail: {email ? email : "none"}</div>
      <h3>Repositories:</h3>
      {repositoriesItem}
    </>
  );
}

export default UserData;
