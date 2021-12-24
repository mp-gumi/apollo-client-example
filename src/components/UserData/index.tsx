import { gql, useQuery } from "@apollo/client";
import styles from "./styles.module.css";
import dayjs from "dayjs";
import { GetUserDataQuery } from "../../generated/types";

type UserDataProps = {
  repositoriesNumber: string;
  githubId: string;
  dataOrder: string;
};

const GET_USER_DATA = gql`
  query getUserData($count: Int!, $id: String!, $dataOrder: OrderDirection!) {
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
          updatedAt
          url
        }
      }
    }
  }
`;

function UserData({ repositoriesNumber, githubId, dataOrder }: UserDataProps) {
  const { loading, error, data } = useQuery<GetUserDataQuery>(GET_USER_DATA, {
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
  } = data?.user || {}; // 左辺がundifinedになるのを避けるため、 || {}をつける
  const repositoriesArray = repositories?.nodes;

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.errorText}>{error.message}</p>;

  const repositoriesItem = repositoriesArray?.map(
    (repository, index: number) => {
      const { createdAt, description, name, updatedAt, url } = repository || {};
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
        <div className={styles.userNamesWrapper}>
          <a href={url} className={styles.iconWrapper}>
            <img src={avatarUrl} alt="icon" className={styles.icon} />
            {userName}
          </a>
          ({login})
        </div>
      </h3>
      <div>Location: {location ? location : "none"}</div>
      <div>Mail: {email ? email : "none"}</div>
      <h3>Repositories:</h3>
      {repositoriesItem}
    </>
  );
}

export default UserData;
