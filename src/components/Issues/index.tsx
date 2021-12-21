import { gql, useQuery } from "@apollo/client";

const GET_ISSUES = gql`
  query {
    search(query: "repo:apollographql/apollo is:issue", type: ISSUE, first: 5) {
      issueCount
      nodes {
        ... on Issue {
          number
          title
        }
      }
    }
  }
`;

function Issues() {
  const { loading, error, data } = useQuery(GET_ISSUES);
  const { issueCount, nodes: issues } = data?.search;

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;
  return (
    <>
      <h2>
        {issueCount
          ? `${issueCount}件の記事が見つかりました`
          : "記事は見つかりませんでした"}
      </h2>
      <ul>
        {issues.map(({ number, title }: { number: number; title: string }) => (
          <li key={number}>
            {number} - {title}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Issues;
