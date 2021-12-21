import { gql, useQuery } from "@apollo/client";
import dayjs from "dayjs";

type UserDataProps = {
  repositoriesNumber: string;
  githubId: string;
};

const GET_USER_DATA = gql`
  query getMyUsers($count: Int!, $id: String!) {
    user(login: $id) {
      login
      name
      location
      email
      url
      avatarUrl
      repositories(
        first: $count
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        nodes {
          createdAt
          description
          name
          url
        }
      }
    }
  }
`;

function UserData({ repositoriesNumber, githubId }: UserDataProps) {
  const { loading, error, data } = useQuery(GET_USER_DATA, {
    variables: { count: parseInt(repositoriesNumber, 10), id: githubId },
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
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  const repositoriesItem = repositoriesArray.map(
    (
      {
        description,
        name,
        createdAt,
        url,
      }: {
        description: string;
        name: string;
        createdAt: string;
        url: string;
      },
      index: number
    ) => {
      return (
        <div key={name} style={{ paddingLeft: 10, paddingBottom: 10 }}>
          <div>
            {index + 1}. <a href={url}>{name}</a>
          </div>
          <div>created date : {dayjs(createdAt).format("YYYY/M/D H:m")}</div>
          <div>description: {description ? description : "none"}</div>
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
