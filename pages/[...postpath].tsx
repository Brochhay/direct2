import React from "react";
import { GetServerSideProps } from "next";
import { GraphQLClient, gql } from "graphql-request";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const endpoint = "https://animalsh.vercel.app/graphql"; // Set primary domain
  const graphQLClient = new GraphQLClient(endpoint);
  const pathArr = ctx.query.postpath as Array<string>;
  const path = pathArr.join("/");
  const fbclid = ctx.query.fbclid;
  const currentDomain = ctx.req.headers.host;

  // Redirect if not on primary domain
  if (currentDomain !== "animalsh.vercel.app") {
    return {
      redirect: {
        permanent: false,
        destination: `https://animalsh.vercel.app/${path}`,
      },
    };
  }

  const query = gql`
    {
      post(id: "/${path}/", idType: URI) {
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  `;

  const data = await graphQLClient.request(query);
  if (!data.post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post: data.post,
    },
  };
};

interface PostProps {
  post: any;
}

const Post: React.FC<PostProps> = (props) => {
  const { post } = props;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <img
        src={post.featuredImage.node.sourceUrl}
        alt={post.featuredImage.node.altText}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          backgroundColor: "black",
        }}
      />
    </div>
  );
};

export default Post;
